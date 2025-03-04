import {Hono} from "hono";
import {serve} from "@hono/node-server";

const app = new Hono();
app.get("/", async (c)=> {
    return c.text("HELLO TEST2");
});
app.get("/api/skoler", (c) => {
    return c.json({
        type: "FeaturedCollection",
        crs: {
            type: "name",
            properties: {
                name: "urn:ogc:def:crs:OGC:1.3:CRS84"
            },
        },
        features: [],
    })
})
serve(app);