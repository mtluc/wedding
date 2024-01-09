import { NextApiRequest, NextApiResponse } from "next";
const svgToImg = require("svg-to-img");
const { convert } = require('convert-svg-to-jpeg');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const svg = `<svg version="1.1" width="1280" height="533">
    <text style="font-size: 13pt" x="50%" y="420" fill="#000000" ominant-baseline="middle" text-anchor="middle">TRÂN TRỌNG KÍNH MỜI</text>
    <text style="font-size: 16pt;font-weight:bold;" x="50%" y="466" fill="red" ominant-baseline="middle" text-anchor="middle">${decodeURIComponent(
      req?.query?.name || ("" as any)
    )}</text>
    <line fill="none" stroke="#000000" stroke-miterlimit="10" x1="500" y1="472" x2="780" y2="472" stroke-dasharray="2,5"/>
</svg>`;
  // res.setHeader("Content-Type", "image/svg+xml");
  // res.setHeader("Content-Length", svg.length);
  // res.status(200).send(svg);

  res.setHeader("Content-Type", "image/jpeg");
 // const image = await svgToImg.from(svg).toJpeg();
  res.status(200).send(await convert(svg));
}
