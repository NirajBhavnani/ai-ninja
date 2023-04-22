// Setup and config to call open ai's api
import express from "express";
import * as dotenv from "dotenv"; //it allows us to get data from env file
import cors from "cors"; //it allows us to make cross-origin-requests
import { Configuration, OpenAIApi } from "openai"; //Wrappers to use OpenAi api

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

// Setup couple of middleware
app.use(cors());
app.use(express.json()); //it allows us to send json from frontend to backend

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from AI-Ninja",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt; //data from frontend textarea

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, //higher the temp value, more the risks the model will take to provide answers
      max_tokens: 3000, //generate max tokens on successful completion
      top_p: 1,
      frequency_penalty: 0.5, //it means no repetition of similar sentences often
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

// make sure that server always listens for new requests
app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);
