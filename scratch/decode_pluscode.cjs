// Open Location Code decoder
const CODE_ALPHABET_ = "23456789CFGHJMPQRVWX";
function decode(code) {
  code = code.replace("+", "");
  let latVal = 0, lngVal = 0;
  let latRes = 20, lngRes = 20;
  for (let i = 0; i < code.length; i += 2) {
    const latDigit = CODE_ALPHABET_.indexOf(code[i].toUpperCase());
    const lngDigit = CODE_ALPHABET_.indexOf(code[i + 1].toUpperCase());
    latRes /= 20;
    lngRes /= 20;
    latVal += latDigit * latRes;
    lngVal += lngDigit * lngRes;
  }
  return { lat: latVal - 90, lng: lngVal - 180 };
}

// 83GF+Q76 is a local code or full code? Full code for Thailand starts with 7P...
// Plus Code in Thailand around 15.33, 100.07:
// Prefix for 15, 100 is 7P52 or similar: 
// 7P: 14 to 16 lat, 100 to 102 lng?
// Let's test what full code produces 83GF+Q76
for (let p1 = 0; p1 < 20; p1++) {
  for (let p2 = 0; p2 < 20; p2++) {
    for (let p3 = 0; p3 < 20; p3++) {
      for (let p4 = 0; p4 < 20; p4++) {
        const full = CODE_ALPHABET_[p1] + CODE_ALPHABET_[p2] + CODE_ALPHABET_[p3] + CODE_ALPHABET_[p4] + "83GFQ76";
        const res = decode(full);
        if (Math.abs(res.lat - 15.33) < 0.1 && Math.abs(res.lng - 100.07) < 0.1) {
          console.log('Full Code:', full, 'Coords:', res);
        }
      }
    }
  }
}
