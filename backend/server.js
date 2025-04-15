import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Task from './models/Task.js';
import taskRoutes from './routes/taskRoutes.js';



dotenv.config();
//console.log(process.env.MONGO_URI);
const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (req,res) => {
    res.send("Hello World!");
})

app.use('/api/tasks', taskRoutes);


app.listen(3000, () => {
    connectDB();
    console.log("Server started at http://localhost:3000");
});

// pGOhPaDAFDyVz0tl