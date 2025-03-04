import {Hono} from "hono";
import {serve} from "@hono/node-server";
import pg from "pg";

const postgresql = new pg.Pool({
    user: "postgres"
});

const app = new Hono();
app.get("/", async (c)=> {
    return c.text("HELLO TEST2");
});
app.get("/api/skoler", async (c) => {
    const result = await postgresql.query(
        "select skolenavn, antallelever, antallansatte, posisjon::json as coordinates from videregaendeskoler_5e440edae4f9461491e0fa7e935818f7.videregaendeskole")
    return c.json({
        type: "FeaturedCollection",
        crs: {
            type: "name",
            properties: {
                name: "urn:ogc:def:crs:OGC:1.3:CRS84"
            },
        },
        features: result.rows.map(({coordinates, ...properties}) => ({
            type: "Feature",
            properties,
            geometry: {
                type: "point",
                coordinates
            }
        }))
    })
})
serve(app);