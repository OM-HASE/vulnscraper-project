package main

import (
    "context"
    "log"
    "time"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017")) // MongoDB Compass
    if err != nil {
        log.Fatal("Failed to connect to MongoDB:", err)
    }
    defer client.Disconnect(ctx)

    db := client.Database("vulnscraper")
    repo := NewVulnerabilityRepository(db)

    fetcher := NewNVDFetcher(repo, "8048515c-25fb-4a14-9f3a-ee37e1cff765") // API Key

    if err := fetcher.FetchLatest(90); err != nil {
        log.Fatal("Fetch failed:", err)
    }

    log.Println("NVD scraping completed successfully.")
}
