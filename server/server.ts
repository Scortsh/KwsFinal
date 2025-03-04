import {Hono} from "hono";
import {serve} from "@hono/node-server";
import pg from "pg";
import {cors} from 'hono/cors'


const postgresql = new pg.Pool({
    user: "postgres"
});

const app = new Hono();
app.use('*', cors());

app.get("/", async (c)=> {
    return c.text("HELLO TEST2");
});
app.get("/api/skoler", async (c) => {
    const result = await postgresql.query(
        `SELECT skolenavn, antallelever, antallansatte, ST_transform(posisjon, 4326)::json AS geometry FROM videregaendeskoler_5e440edae4f9461491e0fa7e935818f7.videregaendeskole`);

    console.log(result.rows);

    return c.json({
        type: "FeatureCollection",
        crs: {
            type: "name",
            properties: {
                name: "urn:ogc:def:crs:OGC:1.3:CRS84"
            },
        },

        features: result.rows.map(({geometry: {coordinates}, ...properties}) => ({
            type: "Feature",
            properties,
            geometry: {
                type: "Point",
                coordinates
            }
        }))
    })
})
serve(app);