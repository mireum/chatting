import { conn } from ".";

// sql에서 가져오기
export const queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const handleSql = async (sql, values) => {
  try {
    const result = await queryAsync(sql, values);
  } catch (error) {
    console.error(error);
  }
  return result;
}