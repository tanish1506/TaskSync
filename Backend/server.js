const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const globalErrorHandler = require('./middleware/errorMiddleware');


const authRouter = require("./routes/authRoutes");
const taskRouter = require('./routes/taskRoutes');


dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`📡 INCOMING REQUEST: [${req.method}] ${req.originalUrl}`);
    next();
});

app.use('/api/auth',authRouter);
app.use('/api/tasks',taskRouter);

app.get("/",(req,res)=>{
    res.json({message : "TaskSync API running smoothly"});
})



app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`\x1b[34m%s\x1b[0m`, `Server running on port : ${PORT}`);
});