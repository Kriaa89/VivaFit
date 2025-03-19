import asyncHandler from 'express-async-handler';
// Fixing the import to match the correct file name
import Program from '../models/program.model.js';

// Create a new workout program
export const createProgram = asyncHandler(async (req, res) => {
    const { programName, workouts } = req.body;
    
    if (!programName || !workouts || !Array.isArray(workouts)) {
        res.status(400);
        throw new Error('Invalid program data. Provide a program name and workouts array.');
    }

    try {
        const program = new Program({
            user: req.dbUser._id, // Assuming auth middleware adds dbUser
            programName,
            workouts
        });

        const savedProgram = await program.save();
        
        res.status(201).json(savedProgram);
    } catch (error) {
        res.status(400);
        throw new Error(`Failed to create program: ${error.message}`);
    }
});

// Get all programs for a user
export const getUserPrograms = asyncHandler(async (req, res) => {
    try {
        const programs = await Program.find({ user: req.dbUser._id })
            .sort({ createdAt: -1 });
        
        res.status(200).json(programs);
    } catch (error) {
        res.status(400);
        throw new Error(`Failed to fetch programs: ${error.message}`);
    }
});

// Get a specific program by ID
export const getProgramById = asyncHandler(async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        
        if (!program) {
            res.status(404);
            throw new Error('Program not found');
        }
        
        // Ensure the user owns this program
        if (program.user.toString() !== req.dbUser._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to access this program');
        }
        
        res.status(200).json(program);
    } catch (error) {
        res.status(400);
        throw new Error(`Failed to fetch program: ${error.message}`);
    }
});

// Update a program
export const updateProgram = asyncHandler(async (req, res) => {
    const { programName, workouts, isActive } = req.body;
    
    try {
        const program = await Program.findById(req.params.id);
        
        if (!program) {
            res.status(404);
            throw new Error('Program not found');
        }
        
        // Ensure the user owns this program
        if (program.user.toString() !== req.dbUser._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to update this program');
        }
        
        // Update fields
        if (programName) program.programName = programName;
        if (workouts) program.workouts = workouts;
        if (isActive !== undefined) program.isActive = isActive;
        
        const updatedProgram = await program.save();
        
        res.status(200).json(updatedProgram);
    } catch (error) {
        res.status(400);
        throw new Error(`Failed to update program: ${error.message}`);
    }
});

// Delete a program - fixed to use findByIdAndDelete instead of remove()
export const deleteProgram = asyncHandler(async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        
        if (!program) {
            res.status(404);
            throw new Error('Program not found');
        }
        
        // Ensure the user owns this program
        if (program.user.toString() !== req.dbUser._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this program');
        }
        
        await Program.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Program deleted successfully' });
    } catch (error) {
        res.status(400);
        throw new Error(`Failed to delete program: ${error.message}`);
    }
});