import mongoose, { Document, Schema } from 'mongoose';

interface IPrompt extends Document {
    userPrompt: string;
    aiResponse: string;
    createdAt: Date;
}

const promptSchema: Schema = new Schema(
    {
        userPrompt: { type: String, required: true },
        aiResponse: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }
);

const Prompt = mongoose.model<IPrompt>('Prompt', promptSchema);

export default Prompt;
