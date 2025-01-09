"use client"

import type { MDConnection } from "@motherduck/wasm-client"

// Create a connection to MotherDuck to be used in the frontend throughout a session.
export default async function initMotherDuckConnection(mdToken: string, database?: string): Promise<MDConnection | undefined> {
    // Only run in browser environment
    if (typeof window === 'undefined') {
        console.warn("MotherDuck connection can only be initialized in browser environment")
        return
    }

    try {
        // Dynamically import MDConnection
        const { MDConnection } = await import("@motherduck/wasm-client")

        const connection = await MDConnection.create({ mdToken })

        if (database) {
            await connection.evaluateQuery(`USE ${database}`)
        }

        return connection
    } catch (error) {
        console.error("Failed to create MotherDuck connection", error)
        throw error
    }
}
