import { sample_data } from "../../common/sample_data.js";
import db from "../../connection/mysql2.js";

export const Query = {
  me: async (parent, args) => {
    const { email, password } = args.input;
    const db_query = db.format(`select * from user where email = ?`, [email]);

    let result = [];

    try {
      result = await db
        .query(db_query)
        .then(([res]) => (res.length ? res[0] : []));
    } catch (error) {
      console.log("error", error);
    }
    if (result.password !== password) {
      return {
        id: "",
        email: "",
        address: "",
      };
    }
    return result;
  },
};
