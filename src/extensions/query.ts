import moment from 'jalali-moment';
import { Query } from 'mongoose';

interface IPaginateProps {
   offset: any;
   size: any;
}

interface IDateRangeProps {
   fromDate?: any;
   toDate?: any;
}

declare module 'mongoose' {
   interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
      regexMatch(
         this: Query<ResultType, DocType, THelpers, RawDocType>,
         fields: Array<string>,
         value?: any
      ): Query<ResultType, DocType, THelpers, RawDocType>;

      paginate(
         this: Query<ResultType, DocType, THelpers, RawDocType>,
         props: IPaginateProps
      ): Query<ResultType, DocType, THelpers, RawDocType>;

      confirmed(
         this: Query<ResultType, DocType, THelpers, RawDocType>
      ): Query<ResultType, DocType, THelpers, RawDocType>;
      rejected(
         this: Query<ResultType, DocType, THelpers, RawDocType>
      ): Query<ResultType, DocType, THelpers, RawDocType>;
      waiting(
         this: Query<ResultType, DocType, THelpers, RawDocType>
      ): Query<ResultType, DocType, THelpers, RawDocType>;

      dateRange(
         this: Query<ResultType, DocType, THelpers, RawDocType>,
         path: string,
         props: IDateRangeProps
      ): Query<ResultType, DocType, THelpers, RawDocType>;
   }
}

Query.prototype.regexMatch = function <
   ResultType,
   DocType,
   THelpers,
   RawDocType
>(this: Query<any, any, any, any>, fields: Array<string>, value?: any) {
   if (value) {
      let regex = fields?.map((title) => {
         return { [`${title}`]: { $regex: value, $options: 'i' } };
      });

      this.or(regex);
   }

   return this;
};
Query.prototype.confirmed = function <
   ResultType,
   DocType,
   THelpers,
   RawDocType
>(this: Query<any, any, any, any>) {
   this.where({
      isConfirm: true,
      isReject: false,
      isActive: true,
   });
   return this;
};
Query.prototype.rejected = function <ResultType, DocType, THelpers, RawDocType>(
   this: Query<any, any, any, any>
) {
   this.where({
      isConfirm: false,
      isReject: true,
      isActive: true,
   });
   return this;
};
Query.prototype.waiting = function <ResultType, DocType, THelpers, RawDocType>(
   this: Query<any, any, any, any>
) {
   this.where({
      isConfirm: false,
      isReject: false,
      isActive: true,
   });
   return this;
};

Query.prototype.paginate = function <ResultType, DocType, THelpers, RawDocType>(
   this: Query<any, any, any, any>,
   props: IPaginateProps
) {
   const { size = 10, offset = 1 } = props;
   const limit = Number(size);
   const skip = (Number(offset) - 1) * Number(limit);
   this.skip(skip).limit(limit);
   return this;
};

Query.prototype.dateRange = function <
   ResultType,
   DocType,
   THelpers,
   RawDocType
>(this: Query<any, any, any, any>, path: string, props: IDateRangeProps) {
   const { fromDate, toDate } = props;

   if (fromDate) {
      const _from = fromDate.replace(/"/g, '');
      this.gte(path, moment(_from).startOf('day').toDate());
   }

   if (toDate) {
      const _to = toDate.replace(/"/g, '');
      this.lte(path, moment(_to).endOf('day').toDate());
   }

   return this;
};

export {};
