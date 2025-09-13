import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        const newUser = await userService.addUser(name, email);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};
