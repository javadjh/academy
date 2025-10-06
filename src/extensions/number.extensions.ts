export {};

declare global {
  interface Number {
    sizeFormater(): string;
  }
}

Number.prototype.sizeFormater = function (): string {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (this == 0) return '0 Byte';
  let i = parseInt(Math.floor(Math.log(this) / Math.log(1024)).toString());
  return Math.round(this / Math.pow(1024, i)) + ' ' + sizes[i];
};
