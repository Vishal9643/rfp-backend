const mongoose = require("mongoose");
const rfpModel = require("../models/rfp.model");
const jwt = require("jsonwebtoken");
const { authSchema6 } = require("../helpers/quotes_validation");
const quotesModel = require("../models/quotes.model");

module.exports = {
  //   createRFP: async (req, res, next) => {
  //     const formData = req.body;
  //     console.log(formData);
  //     try {
  //       result = await authSchema5.validateAsync(formData);
  //       const authHeader = req.headers["authorization"];
  //       const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header
  //       const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET); // Decode the token
  //       const admin_id = decoded.user_id; // Extract the user_id from the decoded token
  //       const doesExist = await rfpModel.findOne({ rfp_no: result.rfp_no });
  //       if (doesExist) {
  //         res.send({ response: "error", error: ["rfp Already Exist"] });
  //         return;
  //       }

  //       const rfp = new rfpModel(result);
  //       const savedrfp = await rfp.save();
  //       //   const accessToken = await signAccessToken(savedUser.id);

  //       res.send({ response: "success" });
  //     } catch (error) {
  //       if (error) {
  //         res.send({ error: error.message });
  //       }
  //       // throw createError.UnprocessableEntity();
  //       // next(error);
  //     }
  //   },
  //   viewRFP: async (req, res, next) => {
  //     try {
  //       const rfp = await rfpModel.find();
  //       res.send({ response: "success", rfps: rfp });
  //     } catch (error) {
  //       next(error);
  //     }
  //   },
  //   closeRFP: async (req, res, next) => {
  //     const id = req.params.id;
  //     const doesExist = await rfpModel.findOneAndUpdate(
  //       { id: id },
  //       { status: "closed" }
  //     );
  //     if (!doesExist) {
  //       res.send({ response: "error", error: ["rfp does not Exist"] });
  //       return;
  //     }

  //     res.send({ response: "success" }); // Send the id in the response
  //   },
  applyRFP: async (req, res, next) => {
    const id = req.params.id;
    const formData = req.body;
    console.log(formData);
    try {
      result = await authSchema6.validateAsync(formData);
      const authHeader = req.headers["authorization"];
      console.log(authHeader);
      const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header
      const decoded = jwt.verify(token, process.env.VENDOR_ACCESS_TOKEN_SECRET); // Decode the token
      console.log(decoded);
      const vendor_id = decoded.user_id; // Extract the user_id from the decoded token
      const email = decoded.email; // Extract the email from the decoded token
      const name = decoded.name;
      //   const last_name = decoded.last_name;
      const mobile = decoded.mobile;

      // const vendor_id = decoded.email; // Extract the user_id from the decoded token
      // const vendor_id = decoded.first_name; // Extract the user_id from the decoded token
      console.log(vendor_id, email);
      result.vendor_id = vendor_id;
      result.email = email;
      result.name = name;
      //   result.last_name = last_name;
      result.mobile = mobile;

      const doesExist = await rfpModel.findOne({ id: id });
      if (!doesExist) {
        res.send({ response: "error", error: ["rfp Does notExist"] });
        return;
      }
      // const first_name, last_name,

      const quotes = new quotesModel(result);
      const savedrfp = await quotes.save();
      //   const accessToken = await signAccessToken(savedUser.id);

      //   res.send({ response: "success" });
    } catch (error) {
      if (error) {
        res.send({ error: error.message });
      }
      // throw createError.UnprocessableEntity();
      // next(error);
    }
    // const doesExist = await rfpModel.find({ vendors: id });
    // if (!doesExist) {
    //   res.send({ response: "error", error: ["No RFP Found"] });
    //   return;
    // }

    res.send({ response: "success", rfps: result }); // Send the id in the response
  },
};
