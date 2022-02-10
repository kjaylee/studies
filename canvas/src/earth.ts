import { createCanvas, loadImage }  from 'canvas';
import fs from 'fs';
// import { geoPath, geoOrthographic, geoGraticule } from 'd3-geo';
// import { select} from 'd3-selection'
import { json } from 'd3-fetch'
// import { transition } from 'd3-transition';
// import { easeLinear, easeExpIn, easeExpOut } from 'd3-ease';
// import { feature, WorldAtlas, presimplify } from "topojson";

(async () => {
    const baseWidth = 512;
    const width = 512;
    const height = width;
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    const landFill = "rgba(255, 255, 255, 0.9)";//"#b9b5ad";
    const seaFill = "#e9e4da";
    const config = {
        speed: 0.1,
        verticalTilt: -20,
        horizontalTilt: 0,
    };
    // let points: Point[] = [];
    const sphere = ({type: "Sphere"});
    // const projection = geoOrthographic().fitExtent([[10, 10], [width - 10, height - 10]], sphere as any);;
    // let world: WorldAtlas;
    // const path = geoPath().projection(projection);
    // const url = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
    const url = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";
    json(url).then(response => {
    //     console.log("JSON");
    //     const data = presimplify(response as WorldAtlas)as WorldAtlas;
    //     world = data;
    //     // projection.scale(0);
    //     render();
    //     // drawStar(); neonLightEffect();
    });
    const render = () => {
        // let data = world;
        // const land = feature(data, data.objects.land);
        // context.save();
        context.clearRect(0, 0, width, height);
        context.fillStyle = seaFill, context.beginPath(), context.fillRect(0, 0, width, height);
        // context.fillStyle = seaFill, context.beginPath(), path(sphere as any), context.fill();
        // context.fillStyle = landFill, context.beginPath(), path(land), context.fill();
        // context.restore();
    }
    render();
    const contents = '<img src="' + canvas.toDataURL() + '" />';
    console.log(contents);
    fs.writeFile("./earth.html", contents, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    //////////
    // Write "Awesome!"
    // ctx.font = '30px Impact'
    // ctx.rotate(0.1)
    // ctx.fillText('Awesome!', 50, 100)
    
    // // Draw line under text
    // var text = ctx.measureText('Awesome!')
    // ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    // ctx.beginPath()
    // ctx.lineTo(50, 102)
    // ctx.lineTo(50 + text.width, 102)
    // ctx.stroke()
    
    // // Draw cat with lime helmet
    // loadImage('../../solana/resources/0.png').then((image) => {
    //   ctx.drawImage(image, 50, 0, 70, 70)
    //   console.log('<img src="' + canvas.toDataURL() + '" />')
    // })
})();