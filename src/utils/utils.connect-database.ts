const sql = require('mssql')

const connectDB = async () => {
   return await sql.connect('Server=192.168.15.174,49172;Database=PHANTICH;User Id=THANHMINH;Password=123beta456;Encrypt=false');
}

export default connectDB;
