import { PropOptions } from '@nestjs/mongoose';

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
export const email: PropOptions<any> = {
  type: String,
  lowercase: true,

  validate: [validateEmail],
  match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};
