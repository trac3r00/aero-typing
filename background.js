// ── WORLD MAP BACKGROUND WITH REAL ROUTES ──
const WorldMap = (function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'world-bg';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;opacity:1;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ── AIRPORTS (code → {lat, lng, name}) ──
  const airports = {
    // North America
    JFK:{lat:40.6,lng:-73.8,name:"New York"},LAX:{lat:33.9,lng:-118.4,name:"Los Angeles"},
    ORD:{lat:41.9,lng:-87.9,name:"Chicago"},ATL:{lat:33.6,lng:-84.4,name:"Atlanta"},
    DFW:{lat:32.9,lng:-97,name:"Dallas"},DEN:{lat:39.9,lng:-104.7,name:"Denver"},
    SFO:{lat:37.6,lng:-122.4,name:"San Francisco"},SEA:{lat:47.4,lng:-122.3,name:"Seattle"},
    MIA:{lat:25.8,lng:-80.3,name:"Miami"},BOS:{lat:42.4,lng:-71,name:"Boston"},
    EWR:{lat:40.7,lng:-74.2,name:"Newark"},IAH:{lat:30,lng:-95.3,name:"Houston"},
    MSP:{lat:44.9,lng:-93.2,name:"Minneapolis"},DTW:{lat:42.2,lng:-83.4,name:"Detroit"},
    PHX:{lat:33.4,lng:-112,name:"Phoenix"},LAS:{lat:36.1,lng:-115.2,name:"Las Vegas"},
    MCO:{lat:28.4,lng:-81.3,name:"Orlando"},CLT:{lat:35.2,lng:-80.9,name:"Charlotte"},
    PHL:{lat:39.9,lng:-75.2,name:"Philadelphia"},SLC:{lat:40.8,lng:-111.9,name:"Salt Lake City"},
    HNL:{lat:21.3,lng:-157.9,name:"Honolulu"},ANC:{lat:61.2,lng:-150,name:"Anchorage"},
    YYZ:{lat:43.7,lng:-79.6,name:"Toronto"},YVR:{lat:49.2,lng:-123.2,name:"Vancouver"},
    YUL:{lat:45.5,lng:-73.7,name:"Montreal"},MEX:{lat:19.4,lng:-99.1,name:"Mexico City"},
    CUN:{lat:21.1,lng:-86.8,name:"Cancun"},
    // Europe
    LHR:{lat:51.5,lng:-0.5,name:"London"},CDG:{lat:49,lng:2.5,name:"Paris"},
    FRA:{lat:50.1,lng:8.6,name:"Frankfurt"},AMS:{lat:52.3,lng:4.8,name:"Amsterdam"},
    MAD:{lat:40.5,lng:-3.6,name:"Madrid"},BCN:{lat:41.3,lng:2.1,name:"Barcelona"},
    FCO:{lat:41.8,lng:12.2,name:"Rome"},MUC:{lat:48.4,lng:11.8,name:"Munich"},
    ZRH:{lat:47.5,lng:8.6,name:"Zurich"},IST:{lat:41,lng:28.8,name:"Istanbul"},
    CPH:{lat:55.6,lng:12.7,name:"Copenhagen"},OSL:{lat:60.2,lng:11.1,name:"Oslo"},
    ARN:{lat:59.6,lng:18,name:"Stockholm"},HEL:{lat:60.3,lng:24.9,name:"Helsinki"},
    DUB:{lat:53.4,lng:-6.3,name:"Dublin"},LIS:{lat:38.8,lng:-9.1,name:"Lisbon"},
    ATH:{lat:37.9,lng:23.9,name:"Athens"},WAW:{lat:52.2,lng:20.9,name:"Warsaw"},
    // Middle East
    DXB:{lat:25.3,lng:55.4,name:"Dubai"},DOH:{lat:25.3,lng:51.6,name:"Doha"},
    AUH:{lat:24.4,lng:54.7,name:"Abu Dhabi"},JED:{lat:21.7,lng:39.2,name:"Jeddah"},
    TLV:{lat:32,lng:34.9,name:"Tel Aviv"},AMM:{lat:31.7,lng:36,name:"Amman"},
    // Asia
    SIN:{lat:1.4,lng:104,name:"Singapore"},HKG:{lat:22.3,lng:114,name:"Hong Kong"},
    NRT:{lat:35.8,lng:140.4,name:"Tokyo"},HND:{lat:35.6,lng:139.8,name:"Tokyo Haneda"},
    ICN:{lat:37.5,lng:126.5,name:"Seoul"},BKK:{lat:13.7,lng:100.7,name:"Bangkok"},
    KUL:{lat:2.7,lng:101.7,name:"Kuala Lumpur"},MNL:{lat:14.5,lng:121,name:"Manila"},
    CGK:{lat:-6.1,lng:106.7,name:"Jakarta"},DEL:{lat:28.6,lng:77.1,name:"Delhi"},
    BOM:{lat:19.1,lng:72.9,name:"Mumbai"},PEK:{lat:40.1,lng:116.6,name:"Beijing"},
    PVG:{lat:31.1,lng:121.8,name:"Shanghai"},CAN:{lat:23.4,lng:113.3,name:"Guangzhou"},
    HAN:{lat:21.2,lng:105.8,name:"Hanoi"},SGN:{lat:10.8,lng:106.7,name:"Ho Chi Minh"},
    TPE:{lat:25.1,lng:121.2,name:"Taipei"},
    // Oceania
    SYD:{lat:-33.9,lng:151.2,name:"Sydney"},MEL:{lat:-37.7,lng:145,name:"Melbourne"},
    AKL:{lat:-37,lng:174.8,name:"Auckland"},
    // Africa
    ADD:{lat:8.9,lng:38.8,name:"Addis Ababa"},CAI:{lat:30.1,lng:31.4,name:"Cairo"},
    JNB:{lat:-26.1,lng:28.2,name:"Johannesburg"},CMN:{lat:33.4,lng:-7.6,name:"Casablanca"},
    NBO:{lat:-1.3,lng:36.9,name:"Nairobi"},
    // South America
    GRU:{lat:-23.4,lng:-46.5,name:"Sao Paulo"},EZE:{lat:-34.8,lng:-58.5,name:"Buenos Aires"},
    SCL:{lat:-33.4,lng:-70.8,name:"Santiago"},BOG:{lat:4.7,lng:-74.1,name:"Bogota"},
    LIM:{lat:-12,lng:-77,name:"Lima"},PTY:{lat:9.1,lng:-79.4,name:"Panama City"},
    GIG:{lat:-22.8,lng:-43.3,name:"Rio de Janeiro"},
  };

  // ── AIRLINE HUBS & ROUTES ──
  const airlineRoutes = {
    "American Airlines":  {hub:"DFW",color:"#e11d48",routes:["DFW-LHR","DFW-NRT","JFK-LHR","JFK-CDG","MIA-GRU","LAX-NRT","LAX-SYD","CLT-LHR","PHL-LHR","ORD-LHR","MIA-BOG","DFW-ICN"]},
    "Delta Air Lines":    {hub:"ATL",color:"#1d4ed8",routes:["ATL-LHR","ATL-CDG","ATL-NRT","JFK-LHR","JFK-CDG","LAX-SYD","LAX-NRT","DTW-AMS","MSP-ICN","ATL-GRU","ATL-JNB","SEA-ICN"]},
    "United Airlines":    {hub:"ORD",color:"#2563eb",routes:["EWR-LHR","EWR-FRA","SFO-NRT","SFO-ICN","SFO-SIN","IAH-LHR","ORD-NRT","LAX-SYD","DEN-NRT","IAH-GRU","EWR-DEL","SFO-HKG"]},
    "Southwest Airlines": {hub:"DFW",color:"#f59e0b",routes:["DFW-LAS","DFW-PHX","DFW-DEN","ORD-LAS","ATL-MCO","DEN-LAX","LAS-SEA","PHX-SFO","DEN-ORD","ATL-DFW","BOS-MCO","LAS-LAX"]},
    "Emirates":           {hub:"DXB",color:"#c2410c",routes:["DXB-LHR","DXB-JFK","DXB-LAX","DXB-SIN","DXB-HKG","DXB-SYD","DXB-NRT","DXB-ICN","DXB-GRU","DXB-JNB","DXB-BKK","DXB-CDG"]},
    "Qatar Airways":      {hub:"DOH",color:"#7c2d12",routes:["DOH-LHR","DOH-JFK","DOH-SIN","DOH-SYD","DOH-BKK","DOH-NRT","DOH-ICN","DOH-DEL","DOH-CDG","DOH-GRU","DOH-JNB","DOH-HKG"]},
    "British Airways":    {hub:"LHR",color:"#1e3a5f",routes:["LHR-JFK","LHR-LAX","LHR-SIN","LHR-HKG","LHR-NRT","LHR-SYD","LHR-DXB","LHR-DEL","LHR-JNB","LHR-GRU","LHR-BOS","LHR-CDG"]},
    "Lufthansa":          {hub:"FRA",color:"#1e3a5f",routes:["FRA-JFK","FRA-ORD","FRA-SIN","FRA-NRT","FRA-ICN","FRA-DEL","FRA-BOM","FRA-GRU","FRA-JNB","FRA-HKG","MUC-LAX","MUC-ICN"]},
    "Air France":         {hub:"CDG",color:"#1e40af",routes:["CDG-JFK","CDG-LAX","CDG-NRT","CDG-SIN","CDG-HKG","CDG-DEL","CDG-GRU","CDG-JNB","CDG-MEX","CDG-BKK","CDG-DXB","CDG-ICN"]},
    "Singapore Airlines": {hub:"SIN",color:"#fbbf24",routes:["SIN-LHR","SIN-JFK","SIN-LAX","SIN-SYD","SIN-NRT","SIN-ICN","SIN-HKG","SIN-DEL","SIN-FRA","SIN-MEL","SIN-BKK","SIN-PEK"]},
    "Cathay Pacific":     {hub:"HKG",color:"#047857",routes:["HKG-LHR","HKG-JFK","HKG-LAX","HKG-SYD","HKG-NRT","HKG-SIN","HKG-BKK","HKG-DEL","HKG-FRA","HKG-AMS","HKG-MEL","HKG-ICN"]},
    "Korean Air":         {hub:"ICN",color:"#1d4ed8",routes:["ICN-JFK","ICN-LAX","ICN-NRT","ICN-SIN","ICN-SYD","ICN-LHR","ICN-CDG","ICN-FRA","ICN-BKK","ICN-DXB","ICN-HNL","ICN-ATL"]},
    "Japan Airlines":     {hub:"NRT",color:"#dc2626",routes:["NRT-JFK","NRT-LAX","NRT-SFO","NRT-ORD","NRT-LHR","NRT-CDG","NRT-SIN","NRT-HKG","NRT-ICN","NRT-BKK","NRT-SYD","NRT-DEL"]},
    "Turkish Airlines":   {hub:"IST",color:"#dc2626",routes:["IST-JFK","IST-LHR","IST-CDG","IST-FRA","IST-DXB","IST-SIN","IST-NRT","IST-ICN","IST-JNB","IST-GRU","IST-DEL","IST-BKK"]},
    "Qantas":             {hub:"SYD",color:"#dc2626",routes:["SYD-LAX","SYD-LHR","SYD-SIN","SYD-HKG","SYD-NRT","SYD-AKL","SYD-DFW","SYD-JNB","SYD-MEL","SYD-DEL","SYD-BKK","MEL-LAX"]},
    "Etihad Airways":     {hub:"AUH",color:"#b45309",routes:["AUH-LHR","AUH-JFK","AUH-SYD","AUH-SIN","AUH-NRT","AUH-ICN","AUH-CDG","AUH-FRA","AUH-DEL","AUH-BKK","AUH-MEL","AUH-HKG"]},
    "Alaska Airlines":    {hub:"SEA",color:"#0369a1",routes:["SEA-LAX","SEA-SFO","SEA-ANC","SEA-HNL","SEA-JFK","SEA-ORD","SEA-DFW","SEA-BOS","SEA-PHX","SEA-LAS","SEA-DEN","ANC-SEA"]},
    "JetBlue Airways":    {hub:"JFK",color:"#2563eb",routes:["JFK-LAX","JFK-SFO","JFK-BOS","JFK-MCO","JFK-MIA","JFK-LHR","BOS-LAX","BOS-MCO","JFK-CUN","JFK-LAS","JFK-SEA","JFK-DEN"]},
    "LATAM Airlines":     {hub:"SCL",color:"#1e3a5f",routes:["SCL-MIA","SCL-JFK","SCL-LAX","SCL-MAD","SCL-CDG","SCL-SYD","SCL-AKL","GRU-MIA","GRU-LHR","GRU-CDG","GRU-JNB","LIM-LAX"]},
    "Air India":          {hub:"DEL",color:"#dc2626",routes:["DEL-LHR","DEL-JFK","DEL-SFO","DEL-NRT","DEL-SIN","DEL-SYD","DEL-FRA","DEL-CDG","DEL-DXB","DEL-BKK","DEL-HKG","BOM-LHR"]},
    "Thai Airways":       {hub:"BKK",color:"#7c3aed",routes:["BKK-LHR","BKK-NRT","BKK-SIN","BKK-HKG","BKK-SYD","BKK-FRA","BKK-CDG","BKK-ICN","BKK-DEL","BKK-PEK","BKK-MEL","BKK-KUL"]},
    "EVA Air":            {hub:"TPE",color:"#047857",routes:["TPE-LAX","TPE-JFK","TPE-SFO","TPE-LHR","TPE-CDG","TPE-NRT","TPE-ICN","TPE-SIN","TPE-HKG","TPE-BKK","TPE-SYD","TPE-YVR"]},
    "Copa Airlines":      {hub:"PTY",color:"#1e40af",routes:["PTY-MIA","PTY-JFK","PTY-LAX","PTY-BOG","PTY-GRU","PTY-SCL","PTY-MEX","PTY-LIM","PTY-EZE","PTY-CUN","PTY-ORD","PTY-IAH"]},
    "Ethiopian Airlines": {hub:"ADD",color:"#15803d",routes:["ADD-LHR","ADD-DXB","ADD-JNB","ADD-NBO","ADD-CAI","ADD-PEK","ADD-DEL","ADD-ICN","ADD-CDG","ADD-FRA","ADD-IAH","ADD-GRU"]},
    "Ryanair":            {hub:"DUB",color:"#1e3a5f",routes:["DUB-LHR","DUB-CDG","DUB-BCN","DUB-FCO","DUB-MAD","DUB-AMS","DUB-FRA","DUB-LIS","DUB-CPH","DUB-WAW","DUB-ATH","DUB-ARN"]},
  };

  // ── CONTINENT OUTLINES (simplified polylines) ──
  const continents = [
    // North America
    [[60,-140],[65,-168],[72,-157],[71,-135],[60,-140],[55,-130],[48,-125],[38,-123],[32,-117],[25,-110],[20,-105],[18,-97],[20,-90],[25,-80],[30,-82],[30,-88],[29,-90],[27,-97],[26,-97],[25,-90],[25,-80],[27,-80],[30,-81],[32,-81],[35,-76],[37,-76],[39,-74],[41,-72],[43,-70],[45,-67],[47,-64],[47,-53],[52,-56],[52,-60],[48,-64],[45,-62],[44,-66],[43,-70],[42,-71],[41,-72],[47,-70],[52,-65],[55,-60],[60,-64],[64,-65],[67,-62],[69,-54],[73,-56],[75,-60],[78,-68],[79,-75],[73,-80],[70,-85],[63,-92],[60,-95],[58,-94],[55,-85],[52,-80],[49,-88],[48,-89],[46,-85],[44,-82],[42,-83],[41,-87],[43,-87],[45,-85],[48,-85],[53,-80],[55,-77],[55,-68],[52,-56]],
    // South America
    [[12,-72],[10,-76],[8,-77],[4,-77],[1,-80],[-2,-80],[-5,-80],[-5,-75],[-4,-70],[-3,-60],[-1,-50],[0,-50],[5,-52],[7,-57],[8,-60],[7,-62],[10,-68],[12,-72]],
    [[-5,-35],[-3,-40],[-1,-50],[-5,-35]],
    [[-5,-75],[-10,-78],[-15,-76],[-18,-70],[-20,-64],[-22,-60],[-23,-43],[-22,-40],[-20,-40],[-15,-39],[-10,-37],[-5,-35],[-1,-50],[-3,-60],[-5,-65],[-5,-75]],
    [[-23,-43],[-25,-48],[-28,-49],[-30,-51],[-33,-52],[-35,-57],[-40,-62],[-42,-64],[-45,-66],[-48,-66],[-50,-70],[-52,-70],[-53,-71],[-55,-67],[-55,-66],[-52,-69],[-48,-66],[-46,-67],[-42,-64],[-38,-58],[-35,-57],[-30,-51],[-25,-48],[-23,-43]],
    // Europe
    [[36,-6],[37,-2],[38,0],[39,3],[41,2],[43,3],[44,8],[45,12],[41,12],[40,18],[38,24],[36,28],[37,36],[40,27],[41,29],[42,28],[43,28],[44,34],[46,38],[48,40],[50,40],[52,42],[55,50],[60,50],[64,42],[67,26],[65,25],[63,20],[62,12],[60,5],[58,7],[55,8],[54,10],[53,6],[51,4],[50,0],[48,-5],[44,-9],[37,-10],[36,-6]],
    // Africa
    [[36,-6],[37,10],[32,13],[31,32],[24,33],[22,37],[15,42],[12,44],[12,50],[2,42],[-2,41],[-5,40],[-10,40],[-15,37],[-20,35],[-25,35],[-30,31],[-34,26],[-34,18],[-30,16],[-20,12],[-15,12],[-10,14],[-5,12],[0,10],[5,4],[5,0],[5,-5],[6,-3],[7,2],[5,10],[0,10],[-5,12],[-12,14],[-17,12],[-13,8],[-5,8],[0,5],[5,0],[7,-2],[10,-15],[15,-17],[20,-17],[25,-15],[30,-10],[35,-6],[36,-6]],
    // Asia (simplified)
    [[42,28],[45,40],[48,50],[50,55],[52,60],[55,65],[55,73],[60,75],[65,80],[68,90],[70,130],[67,140],[62,140],[55,135],[50,130],[48,135],[46,143],[43,145],[40,140],[37,137],[35,130],[30,120],[25,120],[22,114],[21,106],[18,103],[10,106],[8,110],[5,104],[1,104],[-6,106],[-8,112],[-8,115],[2,108],[5,104],[7,100],[3,100],[1,104],[-2,100],[0,98],[6,100],[8,98],[15,100],[18,103],[22,105],[21,100],[18,100],[15,100],[10,80],[8,77],[12,75],[18,73],[22,70],[25,56],[27,50],[30,48],[32,45],[35,36],[37,36],[38,24],[40,27],[41,29],[42,28]],
    // Australia
    [[-12,131],[-12,136],[-14,136],[-16,136],[-17,141],[-20,149],[-28,153],[-33,152],[-35,150],[-37,150],[-39,146],[-38,144],[-35,137],[-35,135],[-32,133],[-32,131],[-30,115],[-25,114],[-22,114],[-20,119],[-15,124],[-12,131]],
  ];

  // ── STATE ──
  let activeAirline = null;
  let animPlanes = [];
  let pulsePhase = 0;
  let journeyMode = false;
  let journeyStops = [];
  let journeyCurrentIdx = 0;
  const idlePlanes = [];
  const NUM_IDLE = 6;

  // Spawn idle ambient planes
  function randomRoute() {
    const codes = Object.keys(airports);
    const a = codes[Math.floor(Math.random()*codes.length)];
    let b = a;
    while (b === a) b = codes[Math.floor(Math.random()*codes.length)];
    return [a, b];
  }
  for (let i = 0; i < NUM_IDLE; i++) {
    const [a,b] = randomRoute();
    idlePlanes.push({from:a, to:b, t:Math.random(), speed:0.0008+Math.random()*0.001});
  }

  // ── PROJECTION ──
  function project(lat, lng) {
    const x = (lng + 180) / 360 * W;
    const y = (90 - lat) / 180 * H;
    return [x, y];
  }

  // ── BEZIER CURVE for great-circle-ish arc ──
  function arcPoints(from, to, steps) {
    const [x1,y1] = project(from.lat, from.lng);
    const [x2,y2] = project(to.lat, to.lng);
    const mx = (x1+x2)/2;
    const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const my = (y1+y2)/2 - dist * 0.15;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = i/steps;
      const x = (1-t)*(1-t)*x1 + 2*(1-t)*t*mx + t*t*x2;
      const y = (1-t)*(1-t)*y1 + 2*(1-t)*t*my + t*t*y2;
      pts.push([x,y]);
    }
    return pts;
  }

  function bezierPoint(from, to, t) {
    const [x1,y1] = project(from.lat, from.lng);
    const [x2,y2] = project(to.lat, to.lng);
    const mx = (x1+x2)/2;
    const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const my = (y1+y2)/2 - dist * 0.15;
    const x = (1-t)*(1-t)*x1 + 2*(1-t)*t*mx + t*t*x2;
    const y = (1-t)*(1-t)*y1 + 2*(1-t)*t*my + t*t*y2;
    return [x,y];
  }

  // ── DRAW ──
  function draw() {
    ctx.clearRect(0, 0, W, H);
    pulsePhase += 0.02;

    // Draw continent outlines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.03)';
    for (const cont of continents) {
      ctx.beginPath();
      for (let i = 0; i < cont.length; i++) {
        const [x,y] = project(cont[i][0], cont[i][1]);
        if (i === 0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw all airport dots (dim)
    for (const code in airports) {
      const a = airports[code];
      const [x,y] = project(a.lat, a.lng);
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.fill();
    }

    // ── JOURNEY MODE VISUALIZATION ──
    if (journeyMode && journeyStops.length > 0) {
      // Draw full journey path
      for (let i = 0; i < journeyStops.length - 1; i++) {
        const from = airports[journeyStops[i]];
        const to = airports[journeyStops[i + 1]];
        if (!from || !to) continue;

        const pts = arcPoints(from, to, 40);
        ctx.beginPath();
        for (let j = 0; j < pts.length; j++) {
          if (j === 0) ctx.moveTo(pts[j][0], pts[j][1]);
          else ctx.lineTo(pts[j][0], pts[j][1]);
        }
        // Visited legs are bright, future legs are dim
        if (i < journeyCurrentIdx) {
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
          ctx.lineWidth = 2;
        } else if (i === journeyCurrentIdx) {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
          ctx.lineWidth = 2.5;
        } else {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }

      // Draw airport dots for journey stops
      journeyStops.forEach((code, i) => {
        const a = airports[code];
        if (!a) return;
        const [x, y] = project(a.lat, a.lng);

        if (i < journeyCurrentIdx) {
          // Visited — green
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#22c55e';
          ctx.fill();
        } else if (i === journeyCurrentIdx) {
          // Current — pulsing blue
          const pulse = 5 + Math.sin(pulsePhase * 2) * 3;
          ctx.beginPath();
          ctx.arc(x, y, pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
        } else {
          // Future — dim
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
          ctx.fill();
        }

        // Label
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = i <= journeyCurrentIdx ? '#60a5fa' : 'rgba(96, 165, 250, 0.4)';
        ctx.fillText(code, x, y - 10);
      });
    }

    // ── ACTIVE AIRLINE ROUTES ──
    if (activeAirline && airlineRoutes[activeAirline]) {
      const ar = airlineRoutes[activeAirline];
      const color = ar.color;

      // Draw hub (pulsing)
      if (airports[ar.hub]) {
        const [hx,hy] = project(airports[ar.hub].lat, airports[ar.hub].lng);
        const pulse = 4 + Math.sin(pulsePhase * 2) * 3;
        ctx.beginPath();
        ctx.arc(hx, hy, pulse, 0, Math.PI*2);
        ctx.fillStyle = color + '40';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        // Hub label
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(ar.hub, hx, hy - 8);
      }

      // Draw routes
      for (const route of ar.routes) {
        const [fromCode, toCode] = route.split('-');
        const from = airports[fromCode];
        const to = airports[toCode];
        if (!from || !to) continue;

        // Route arc
        const pts = arcPoints(from, to, 40);
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          if (i === 0) ctx.moveTo(pts[i][0], pts[i][1]);
          else ctx.lineTo(pts[i][0], pts[i][1]);
        }
        ctx.strokeStyle = color + '50';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Destination dot
        const [dx,dy] = project(to.lat, to.lng);
        ctx.beginPath();
        ctx.arc(dx, dy, 2.5, 0, Math.PI*2);
        ctx.fillStyle = color + '90';
        ctx.fill();
      }
    }

    // ── ANIMATED PLANES (shared by journey + airline mode) ──
    for (const p of animPlanes) {
      p.t += p.speed;
      if (p.t >= 1) {
        if (journeyMode) {
          p.t = 0; // loop on current leg
        } else {
          Object.assign(p, {t: 0});
        }
      }

      const from = airports[p.from];
      const to = airports[p.to];
      if (!from || !to) continue;

      const [px,py] = bezierPoint(from, to, p.t);
      const [nx,ny] = bezierPoint(from, to, Math.min(p.t+0.02, 1));
      const angle = Math.atan2(ny-py, nx-px);

      const planeColor = journeyMode ? '#60a5fa' : (activeAirline && airlineRoutes[activeAirline] ? airlineRoutes[activeAirline].color : '#60a5fa');

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);

      ctx.fillStyle = planeColor;
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-5, -4);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-5, 4);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = planeColor + '60';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-20, 0);
      ctx.stroke();

      ctx.restore();
    }

    // ── IDLE AMBIENT PLANES ──
    if (!activeAirline) {
      for (const p of idlePlanes) {
        p.t += p.speed;
        if (p.t >= 1) {
          const [a,b] = randomRoute();
          p.from = a; p.to = b; p.t = 0;
        }
        const from = airports[p.from];
        const to = airports[p.to];
        if (!from || !to) continue;

        const [px,py] = bezierPoint(from, to, p.t);
        const [nx,ny] = bezierPoint(from, to, Math.min(p.t+0.02, 1));
        const angle = Math.atan2(ny-py, nx-px);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.5)';
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(-3, -2.5);
        ctx.lineTo(-1, 0);
        ctx.lineTo(-3, 2.5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(-12, 0);
        ctx.stroke();
        ctx.restore();
      }
    }

    requestAnimationFrame(draw);
  }

  draw();

  // ── PUBLIC API ──
  return {
    setAirline(name) {
      activeAirline = name;
      journeyMode = false;
      animPlanes = [];
      if (name && airlineRoutes[name]) {
        const ar = airlineRoutes[name];
        const routesCopy = [...ar.routes];
        for (let i = routesCopy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random()*(i+1));
          [routesCopy[i], routesCopy[j]] = [routesCopy[j], routesCopy[i]];
        }
        const count = Math.min(4, routesCopy.length);
        for (let i = 0; i < count; i++) {
          const [a,b] = routesCopy[i].split('-');
          animPlanes.push({from:a, to:b, t:Math.random()*0.5, speed:0.003+Math.random()*0.002});
        }
      }
    },
    showJourneyLeg(fromCode, toCode, allStops, currentIdx) {
      activeAirline = null;
      journeyMode = true;
      journeyStops = allStops;
      journeyCurrentIdx = currentIdx;
      animPlanes = [];
      // Animate plane on current leg
      if (fromCode && toCode && airports[fromCode] && airports[toCode]) {
        animPlanes.push({from: fromCode, to: toCode, t: 0, speed: 0.004});
      }
    },
    clear() {
      activeAirline = null;
      journeyMode = false;
      journeyStops = [];
      journeyCurrentIdx = 0;
      animPlanes = [];
    }
  };
})();
