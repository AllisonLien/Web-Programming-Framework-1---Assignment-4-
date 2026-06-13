const fs = require("fs");
const path = require("path");
const [
 ,
 ,
 inputFile,
 outputFile,
 categoryField = "category",
 titleField = "name"
] = process.argv;
if (!inputFile || !outputFile) {
 console.log(`
Usage:
node tools/add-images.js <inputFile> <outputFile> <categoryField> <titleField>
Examples:
node tools/add-images.js data/dataset.json data/dataset-with-images.json category name
node tools/add-images.js data/dataset.json data/dataset-with-images.json genre title
node tools/add-images.js data/dataset.json data/dataset-with-images.json cuisine name
`);
 process.exit(1);
}
function slugify(value) {
 return String(value || "item")
 .toLowerCase()
 .replace(/[^a-z0-9]+/g, "-")
 .replace(/^-|-$/g, "");
}
const inputPath = path.join(process.cwd(), inputFile);
const outputPath = path.join(process.cwd(), outputFile);
const rawData = fs.readFileSync(inputPath, "utf-8");
const dataset = JSON.parse(rawData);
if (!Array.isArray(dataset)) {
 console.error("This script expects the JSON file to contain an array of records.");
 process.exit(1);
}
const enriched = dataset.map((item) => {
 const category = item[categoryField] || "general";
 const title = item[titleField] || item.title || item.name || item.id;
 const seed = slugify(`${category}-${title}-${item.id}`);
 return {
 ...item,
 imageUrl: `https://picsum.photos/seed/${seed}/600/400`,
 imageAlt: `${title} image`,
 imageCredit: "Lorem Picsum",
 imageCreditUrl: "https://picsum.photos/"
 };
});
fs.writeFileSync(outputPath, JSON.stringify(enriched, null, 2));
console.log(`Done. Added images to ${enriched.length} records.`);
console.log(`Output saved to: ${outputFile}`);