const { z } = require('zod');

module.exports.validateLead = async (data) => {
  const lead = z.object({
    email: z.string().email(),
  });

  let hasError = false;
  let validData = {};
  let message;
  try {
    validData = lead.parse(data);
    message = '';
  } catch (e) {
    console.log(e);
    hasError = true;
    message = 'invalid email, please try again';
  }

  return {
    data: validData,
    hasError,
    message,
  };
};
