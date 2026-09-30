/* ============================================================
   DATA: this is the only file you need to edit.

   TEACHERS: name must be unique.
     photo = image URL, or '' for a colored initial.
     Local files (e.g. 'photos/dana.jpg') and data: URLs always work
     in the exported image. Remote URLs must allow cross-origin
     loading (CORS), otherwise the placeholder is used in the PNG.
   JOBS: does not necessarily need to be unique.
   ============================================================ */
const TEACHERS = [
  { name: 'הרב יהונתן',  photo: 'img/harav-yehonatan.png' },
  { name: 'הרב דוד',   photo: 'img/harav-david.png' },
  { name: 'הרב שוקי',    photo: 'img/harav-shuki.png' },
  { name: 'רזיאלה',       photo: '' }, //
  { name: 'הרב יהושע',       photo: 'img/harav-yehoshua.png' },
  { name: 'הרב דן',    photo: 'img/harav-dan.png' },
  { name: 'שמואל',   photo: '' }, //
  { name: 'תני',     photo: '' }, //
  { name: 'הרב אייל',   photo: 'img/harav-eyal.png' }, 
  { name: 'יפים',     photo: 'img/yafim.png' },
  { name: 'הרב גיא',    photo: 'img/harav-guy.png' },
  { name: 'הרב חנן',      photo: 'img/harav-hanan.png' },
  { name: 'הרב נריה',    photo: 'img/harav-neria.png' },
  { name: 'הרב אוריאל חכים',      photo: 'img/harav-uriel-hakim.png' },
   {name: "שמואל שיבר", photo: ''}, //
   {name: "הרב אוריאל סגל", photo: ''}, //
   {name: "הרב רפאל", photo: ''}, //
   {name: "הרב נווה", photo: ''},  //
   {name: "הרב ידידיה", photo: ''},  //
   {name: "הרב יועד", photo: 'img/harav-yoad.png'}
];

const JOBS = [
  { title: 'ראש הישיבה' },
   {title: 'סגן ראש הישיבה'},
  { title: 'מנהל תיכון' },
  { title: 'ר"מ אשכולות' },
  { title: 'רמ"ש אשכולות' },
  { title: 'אב בית' },
  { title: 'מאבטח' },
  { title: `ר"מ ט'` },
   { title: `ר"מ י'` },
   { title: `ר"מ י"א` },
   { title: `ר"מ י"ב` },
   { title: 'רמ"ש' },
   { title: 'רמ"ש' },
   { title: "יועץ"}
   
];

const TITLE  = 'מערבבים את שפע';  // headline on site and image
const FOOTER = 'ישיבת שפע';    // small footer text on the image
