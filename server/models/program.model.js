import { Schema, model } from 'mongoose';

const exerciseSchema = new Schema({
    exerciseId: {
        type: String,
        required: true
    },
    exerciseName: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        default: 3,
        min: 1,
        max: 20
    },
    reps: {
        type: Number,
        default: 10,
        min: 1,
        max: 100
    },
    restTime: {
        type: Number, // in seconds
        default: 60
    },
    gifUrl: String
});

const workoutSchema = new Schema({
    dayOfWeek: {
        type: String,
        enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ],
        required: true
    },
    exercises: [exerciseSchema]
});

const programSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        programName: {
            type: String,
            required: true,
            trim: true
        },
        workouts: [workoutSchema],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Program = model('Program', programSchema);
export default Program;
