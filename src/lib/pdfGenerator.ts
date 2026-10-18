import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { RentalOrder, RentVehicle } from '@/types/rent';

import { LOGO_BASE64 } from '@/lib/pdfLogo';

const A4_W = 210;
const A4_H = 297;
const MARGIN = 8;
const CONTENT_W = A4_W - MARGIN * 2;

function addFont(doc: jsPDF, base64: string, filename: string, weight: 'normal' | 'bold') {
  doc.addFileToVFS(filename, base64);
  doc.addFont(filename, 'Roboto', weight);
}

async function ensureFonts(doc: jsPDF) {
  const { ROBOTO_REGULAR, ROBOTO_BOLD } = await import('@/lib/pdfFonts');
  addFont(doc, ROBOTO_REGULAR, 'Roboto-Regular.ttf', 'normal');
  addFont(doc, ROBOTO_BOLD, 'Roboto-Bold.ttf', 'bold');
  doc.setFont('Roboto', 'normal');
}

async function loadImage(url: string): Promise<string> {
  if (url.startsWith('data:')) return url;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Napaka pri nalaganju slike: ${response.status}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function loadLogo(doc: jsPDF): Promise<void> {
  try {
    const logoW = 70;
    const logoH = 18;
    const x = (A4_W - logoW) / 2;
    doc.addImage(LOGO_BASE64, 'JPEG', x, 10, logoW, logoH);
  } catch {
    // Fallback text logo if image cannot be loaded
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text('ŠTUCIN', A4_W / 2, 18, { align: 'center' });
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(12);
    doc.text('ASISTENCA 24h', A4_W / 2, 26, { align: 'center' });
  }
}

async function addHeader(doc: jsPDF) {
  await loadLogo(doc);

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  const infoY = 33;
  doc.text(
    'AVTOVLEKA IN POPRAVILA MARTIN ŠTUCIN S.P. | Goriška cesta 6f, SI-5271 Vipava',
    A4_W / 2,
    infoY,
    { align: 'center' }
  );
  doc.text(
    'ID za DDV: Si707774536 | www.avtovleka-stucin.si | stucin.martin@gmail.com | +386 (0)51 200 404',
    A4_W / 2,
    infoY + 3.5,
    { align: 'center' }
  );

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, infoY + 5.5, A4_W - MARGIN, infoY + 5.5);
}

function splitDateTime(iso?: string): { date: string; time: string } {
  if (!iso) return { date: '-', time: '-' };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: '-', time: '-' };
  return {
    date: d.toLocaleDateString('sl-SI'),
    time: d.toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' }),
  };
}

function formatKm(km?: number): string {
  return km === undefined || km === null ? '-' : km.toLocaleString('sl-SI');
}

function yesNoX(value?: boolean): string {
  return value === true ? 'X' : '\u00A0';
}

function sectionTitle(doc: jsPDF, text: string, x: number, y: number, width = CONTENT_W) {
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(40, 40, 40);
  doc.rect(x, y - 4, width, 6, 'F');
  doc.text(text, x + 2, y);
  doc.setTextColor(0, 0, 0);
}

function rentalInfoBlock(doc: jsPDF, order: RentalOrder, startY: number) {
  const leftX = MARGIN;
  const leftW = 116;
  const rightX = leftX + leftW + 4;

  const customer = order.customer;
  const rental = order.rental;
  const start = splitDateTime(rental.startDate);
  const end = splitDateTime(rental.expectedReturnDate || rental.actualReturnDate);

  autoTable(doc, {
    startY: startY,
    theme: 'plain',
    tableWidth: leftW,
    margin: { left: leftX },
    styles: { fontSize: 8.5, font: 'Roboto', cellPadding: 0.8 },
    columnStyles: {
      0: { cellWidth: 52, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
    },
    body: [
      ['Ime in priimek najemnika:', customer.fullName || '-'],
      ['Naslov najemnika:', customer.address || '-'],
      ['Voznik po potnem nalogu:', customer.authorizedDriver || '-'],
      ['Emšo in davčna številka:', `${customer.emso || '-'} / ${customer.taxNumber || '-'}`],
      ['Telefon:', customer.phone || '-'],
    ],
  });

  // Right column - dates
  let y = startY + 1;
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8);
  doc.text('Datum najema:', rightX, y);
  doc.setFont('Roboto', 'normal');
  doc.text(start.date, rightX + 28, y);
  doc.setFont('Roboto', 'bold');
  doc.text('Ura:', rightX + 52, y);
  doc.setFont('Roboto', 'normal');
  doc.text(start.time, rightX + 60, y);

  y += 8;
  doc.setFont('Roboto', 'bold');
  doc.text('Datum vrnitve:', rightX, y);
  doc.setFont('Roboto', 'normal');
  doc.text(end.date, rightX + 28, y);
  doc.setFont('Roboto', 'bold');
  doc.text('Ura:', rightX + 52, y);
  doc.setFont('Roboto', 'normal');
  doc.text(end.time, rightX + 60, y);

  return startY + 28;
}

function vehicleDataTable(doc: jsPDF, order: RentalOrder, vehicle: RentVehicle, startY: number) {
  const x = MARGIN;
  const w = 115;

  sectionTitle(doc, 'PODATKI O VOZILU', x, startY, w);
  startY += 7;

  const rental = order.rental;

  // Simple data rows (2 columns)
  autoTable(doc, {
    startY: startY,
    theme: 'grid',
    tableWidth: w,
    margin: { left: x },
    styles: { fontSize: 7.5, font: 'Roboto', cellPadding: 1 },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
    },
    body: [
      ['Znamka', vehicle.make],
      ['Tip vozila', vehicle.type || '-'],
      ['Reg. št.', vehicle.licensePlate],
      ['Začetni km:', formatKm(rental.startKm)],
      ['Končni km:', formatKm(rental.returnKm)],
      ['Datum poteka reg.', vehicle.registrationExpiry || '-'],
    ],
  });

  const table1EndY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  const nbsp = '\u00A0';

  // Option rows with clear DA / NE columns
  autoTable(doc, {
    startY: table1EndY,
    theme: 'grid',
    tableWidth: w,
    margin: { left: x },
    head: [['', 'DA', 'NE']],
    styles: { fontSize: 7.5, font: 'Roboto', cellPadding: 1 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 11, halign: 'center' },
      2: { cellWidth: 11, halign: 'center' },
    },
    body: [
      ['Zavarovanje oseb:', yesNoX(true), yesNoX(false)],
      ['Zavarovanje kasko:', yesNoX(true), yesNoX(false)],
      ['Dostava vozila:', yesNoX(rental.delivery), yesNoX(!rental.delivery)],
      ['Dostava z vleko:', yesNoX(rental.deliveryWithTow), yesNoX(!rental.deliveryWithTow)],
      ['Kraj dostave:', rental.deliveryLocation || '-', nbsp],
      ['Prevzem vozila:', yesNoX(rental.pickup), yesNoX(!rental.pickup)],
      ['Prevzem z vleko:', yesNoX(rental.pickupWithTow), yesNoX(!rental.pickupWithTow)],
      ['Kraj prevzema:', rental.pickupLocation || '-', nbsp],
    ],
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
}

function conditionTable(doc: jsPDF, order: RentalOrder, startY: number) {
  const x = MARGIN + 115 + 5;
  const w = CONTENT_W - 115 - 5;

  sectionTitle(doc, 'STANJE VOZILA', x, startY, w);
  startY += 8;

  const equipment = order.condition.equipment;
  const items: { key: keyof typeof equipment; label: string }[] = [
    { key: 'documents', label: 'Dokumenti' },
    { key: 'firstAid', label: 'Prva pomoč' },
    { key: 'jack', label: 'Dvigalo' },
    { key: 'bulbs', label: 'Žarnice' },
    { key: 'triangle', label: 'Trikotnik' },
    { key: 'spareWheel', label: 'Rezervna guma' },
    { key: 'fireExtinguisher', label: 'Gasilni aparat' },
    { key: 'radio', label: 'Radio' },
    { key: 'antenna', label: 'Antena' },
  ];

  autoTable(doc, {
    startY: startY,
    theme: 'grid',
    tableWidth: w,
    margin: { left: x },
    head: [['', 'DA', 'NE']],
    body: items.map((item) => [item.label, yesNoX(true), yesNoX(false)]),
    styles: { fontSize: 7.5, font: 'Roboto', cellPadding: 1 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 11, halign: 'center' },
      2: { cellWidth: 11, halign: 'center' },
    },
  });

  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
}

function damageSection(doc: jsPDF, order: RentalOrder, startY: number, mode: 'pre' | 'post', x = MARGIN, w = CONTENT_W) {
  sectionTitle(doc, 'POŠKODBE VOZILA:', x, startY, w);
  startY += 7;

  const notes = mode === 'pre' ? order.condition.damageNotesOut : order.condition.damageNotesIn;
  const lines = notes ? notes.split('\n') : [];

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  for (let i = 0; i < 4; i++) {
    const y = startY + i * 6;
    doc.line(x, y, x + w, y);
    if (lines[i]) {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(7.5);
      doc.text(lines[i], x + 1, y - 1.5);
    }
  }

  return startY + 4 * 6 + 1;
}

function termsSection(doc: jsPDF, startY: number, x = MARGIN, width = CONTENT_W) {
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('POGOJI:', x, startY);

  const terms = [
    'Voznikova starost najmanj 21 let.',
    'Vozniško dovoljenje mora biti staro najmanj dve leti.',
    'Gorivo ni vključeno v ceno, najemnik mora vrniti poln rezervoar goriva ob vračanju vozila, sicer zaračunamo razliko in 3,00 € za polnjenje goriva.',
    'V času najema najemnik odgovarja sam za vse prekrške, ki jih je storil z najetim vozilom.',
    'V primeru prometne nezgode se mora na kraj nezgode obvezno poklicati policijo in zahtevati uradni zapisnik.',
    'Za vse poškodbe in okvare vozila, ki jih najemnik stori namerno ali iz malomarnosti, odgovarja najemnik sam, škodo do vrednosti 200€ najemnik krije sam.',
    'Za morebitne spore je pristojno Okrajno sodišče v Novi Gorici.',
  ];

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7);

  let y = startY + 4;
  terms.forEach((term, idx) => {
    const text = `${idx + 1}. ${term}`;
    const split = doc.splitTextToSize(text, width - 5);
    doc.text(split, x + 3, y);
    y += split.length * 3 + 0.5;
  });

  return y;
}

function statementSection(doc: jsPDF, startY: number) {
  const x = MARGIN;
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text('Pregledal sem vozilo in opremo in nimam pripomb.', x, startY);
  doc.text('Prebral sem, razumel in s podpisom pogodbe sprejemam vse splošne pogoje, ki so natisnjeni na tej strani.', x, startY + 3);
  return startY + 7;
}

async function addSignatures(
  doc: jsPDF,
  startY: number,
  signatures: RentalOrder['signatures'],
  mode: 'pre' | 'post'
) {
  const customerKey = mode === 'pre' ? 'customerOut' : 'customerIn';
  const employeeKey = mode === 'pre' ? 'employeeOut' : 'employeeIn';

  // Za zaključni PDF uporabi podpisa iz prevzema, če vrnitveni podpisa nista shranjena.
  const customerSrc = signatures[customerKey] || signatures.customerOut;
  const employeeSrc = signatures[employeeKey] || signatures.employeeOut;

  const [customerImg, employeeImg] = await Promise.all([
    customerSrc
      ? loadImage(customerSrc).catch((err) => {
          console.warn('Napaka pri nalaganju podpisa najemnika:', err);
          return '';
        })
      : Promise.resolve(''),
    employeeSrc
      ? loadImage(employeeSrc).catch((err) => {
          console.warn('Napaka pri nalaganju podpisa izdajatelja:', err);
          return '';
        })
      : Promise.resolve(''),
  ]);

  const lineY = startY + 11;
  const leftX = MARGIN;
  const rightX = MARGIN + CONTENT_W / 2 + 5;
  const lineW = CONTENT_W / 2 - 10;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(leftX, lineY, leftX + lineW, lineY);
  doc.line(rightX, lineY, rightX + lineW, lineY);

  if (customerImg) {
    try {
      doc.addImage(customerImg, 'PNG', leftX, startY - 2, lineW, 11);
    } catch (err) {
      console.warn('Napaka pri risanju podpisa najemnika:', err);
    }
  }
  if (employeeImg) {
    try {
      doc.addImage(employeeImg, 'PNG', rightX, startY - 2, lineW, 11);
    } catch (err) {
      console.warn('Napaka pri risanju podpisa izdajatelja:', err);
    }
  }

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7.5);
  doc.text('Podpis najemnika', leftX, lineY + 3.5);
  doc.text('Podpis izdajatelja', rightX, lineY + 3.5);
}

async function addPhotosSection(doc: jsPDF, photos: string[]) {
  if (!photos || photos.length === 0) return;

  doc.addPage();
  await addHeader(doc);

  let y = 44;
  sectionTitle(doc, 'SLIKE STANJA VOZILA OB VRNITVI:', MARGIN, y, CONTENT_W);
  y += 10;

  const cols = 2;
  const gap = 6;
  const imgW = (CONTENT_W - gap * (cols - 1)) / cols;
  const imgH = imgW * 0.75;

  let currentPageStartY = y;
  let row = 0;
  let col = 0;

  for (let i = 0; i < photos.length; i++) {
    const x = MARGIN + col * (imgW + gap);
    const yPos = currentPageStartY + row * (imgH + gap);

    if (yPos + imgH > A4_H - MARGIN) {
      doc.addPage();
      await addHeader(doc);
      currentPageStartY = 44;
      sectionTitle(doc, 'SLIKE STANJA VOZILA OB VRNITVI (nadaljevanje):', MARGIN, currentPageStartY, CONTENT_W);
      currentPageStartY += 10;
      row = 0;
      col = 0;
      continue;
    }

    try {
      const img = await loadImage(photos[i]);
      doc.addImage(img, 'JPEG', x, yPos, imgW, imgH);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      doc.rect(x, yPos, imgW, imgH);
    } catch (err) {
      console.warn('Napaka pri nalaganju slike:', err);
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(8);
      doc.text('Slika ni na voljo', x + 2, yPos + 10);
    }

    col++;
    if (col >= cols) {
      col = 0;
      row++;
    }
  }
}

async function generateContractPdf(
  order: RentalOrder,
  vehicle: RentVehicle,
  mode: 'pre' | 'post'
): Promise<string> {
  const doc = new jsPDF('p', 'mm', 'a4');
  await ensureFonts(doc);
  await addHeader(doc);

  // Title
  let y = 44;
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const titleText = 'POGODBA - PRIMOPREDAJNI ZAPISNIK ŠT.:';
  const protocolText = order.rental.protocolNumber || '';
  const titleW = doc.getTextWidth(titleText);
  doc.text(titleText, MARGIN, y);
  doc.setFont('Roboto', 'normal');
  doc.text(protocolText, MARGIN + titleW + 4, y);
  doc.setFont('Roboto', 'bold');
  doc.setLineWidth(0.3);
  doc.line(MARGIN + titleW + 2, y, A4_W - MARGIN, y);

  y = 52;
  y = rentalInfoBlock(doc, order, y);

  // Side-by-side tables
  const tableY = y + 4;
  const vehicleEndY = vehicleDataTable(doc, order, vehicle, tableY);
  const conditionEndY = conditionTable(doc, order, tableY);

  // Right column: damage section directly below condition table
  const rightX = MARGIN + 115 + 5;
  const rightW = CONTENT_W - 115 - 5;
  const damageY = conditionEndY + 3;
  const damageEndY = damageSection(doc, order, damageY, mode, rightX, rightW);

  // Left column: terms + statement below vehicle data table
  const termsY = vehicleEndY + 3;
  let leftY = termsSection(doc, termsY, MARGIN, 115);
  leftY = statementSection(doc, leftY);

  // Signatures at the bottom of the page
  const signatureY = Math.min(Math.max(Math.max(leftY, damageEndY) + 4, 245), 260);
  await addSignatures(doc, signatureY, order.signatures, mode);

  // Photos for post-rental PDF
  if (mode === 'post' && order.condition.damagePhotosIn?.length) {
    await addPhotosSection(doc, order.condition.damagePhotosIn);
  }

  return doc.output('datauristring');
}

export async function generatePreRentalPdf(
  order: RentalOrder,
  vehicle: RentVehicle
): Promise<string> {
  return generateContractPdf(order, vehicle, 'pre');
}

export async function generatePostRentalPdf(
  order: RentalOrder,
  vehicle: RentVehicle
): Promise<string> {
  return generateContractPdf(order, vehicle, 'post');
}

export async function openPdfDataUrl(dataUrl: string): Promise<void> {
  // Za neposredne povezave (npr. Supabase Storage) odpri takoj, da se izognemo
  // blokiranju novega zavihka zaradi asinhronega klica na mobilnih brskalnikih.
  if (!dataUrl.startsWith('data:')) {
    const newWindow = window.open(dataUrl, '_blank');
    if (!newWindow) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.target = '_blank';
      a.click();
    }
    return;
  }

  const [, base64] = dataUrl.split(',');
  const byteString = atob(base64);
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, '_blank');
  if (!newWindow) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.click();
  }
}
