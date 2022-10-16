import DB from "../connection/mysql2.js";
import { ERROR_DB_ACCESS_LOG } from "../common/constant.js";

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const query = DB.format(`select * from user where id = ?`, [id]);

  let result = [];

  try {
    result = await DB.query(query).then(([res]) => (res.length ? res[0] : []));
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: ERROR_DB_ACCESS_LOG,
    });
  }
  res.status(200).json({
    success: true,
    result,
  });
};
