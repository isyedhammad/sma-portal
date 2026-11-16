import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generatePdf() {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const primaryColor = rgb(0.004, 0.255, 0.11); // Government Emerald #01411C
  const goldColor = rgb(0.7, 0.55, 0.15);
  const textColor = rgb(0.12, 0.16, 0.22);
  const mutedColor = rgb(0.35, 0.4, 0.45);

  const sections = [
    {
      title: "PRELIMINARY & DEFINITIONS",
      items: [
        "1. Short Title and Commencement: (1) These rules may be called the Punjab Mining Concession Rules, 2002. (2) They shall extend to the whole of the Province of the Punjab and shall come into force at once.",
        "2. Definitions: In these rules, unless there is anything repugnant in the subject or context:",
        "  (a) 'Authority' or 'Licensing Authority' means the officer or authority authorized to grant, regulate, and administer mining concessions under these rules;",
        "  (b) 'Small Scale Mining (SSM)' means mining operations carried out under Small Mines Assistance/Titles (SMA) frameworks for designated acreage and production capacities;",
        "  (c) 'Mining Lease (ML)' means a lease granted to mine, extract, and dispose of specified minerals within a demarcated concession area under these rules;",
        "  (d) 'Prospecting License (PL)' means a license to prospect, survey, and explore for minerals within a designated block;",
        "  (e) 'Personal Hearing' means statutory hearing granted to a lessee or licensee before the Licensing Authority in accordance with natural justice and the provisions of these rules;",
        "  (f) 'District Mining Officer (DMO)' means the officer in charge of mineral administration in the respective district of the Punjab."
      ]
    },
    {
      title: "SMALL SCALE MINING (ML & PL) FRAMEWORK",
      items: [
        "3. Application for Mining Concession: Every application for a Prospecting License or Mining Lease shall be submitted in prescribed format to the Licensing Authority accompanied by statutory application fees, cadastral survey coordinates, and valid credentials.",
        "4. Prospecting License (PL) Conditions: A Prospecting License shall confer exclusive right to prospect for specified minerals across demarcated acreage for an initial period not exceeding 2 years, subject to timely progress reports.",
        "5. Conversion into Mining Lease (ML): A licensee who has discovered commercial mineral deposits during the prospecting term may apply for conversion into a full Mining Lease (ML) subject to approved mining scheme.",
        "6. Period and Renewal of Mining Lease: A Mining Lease for small-scale mining shall be granted for a statutory period up to 10 years, renewable upon satisfactory compliance with royalty payments, production targets, and environmental safeguards."
      ]
    },
    {
      title: "ROYALTY, SURFACE RENT & TREASURY OBLIGATIONS",
      items: [
        "7. Payment of Royalties: The lessee shall pay royalty at statutory rates notified by the Government on all minerals extracted, dispatched, or sold from the leased area.",
        "8. Surface Rent and Dead Rent: Annual surface rent and statutory dead rent shall be deposited into the Government treasury through prescribed computerized treasury challans (NBP/State Bank).",
        "9. Inspection of Weighbridges and Despatches: The Licensing Authority or authorized field officer shall have powers to inspect dispatch registers, pitheads, weighbridges, and transit permits."
      ]
    },
    {
      title: "STATUTORY PERSONAL HEARINGS & POST-HEARING ORDERS (RULES 48 & 56)",
      items: [
        "10. Statutory Notice of Default (Rule 48): (1) Where a lessee or licensee commits a breach of any condition of lease, defaults on royalty dues, encroaches outside demarcated boundaries, or fails to submit monthly production returns, the Licensing Authority shall serve a formal Show-Cause Notice specifying the grounds of default.",
        "11. Opportunity of Personal Hearing: (2) The notice recipient shall be granted not less than 15 days to submit a written explanation and shall be afforded an opportunity of statutory Personal Hearing before the Licensing Authority.",
        "12. Quasi-Judicial Proceedings and Bench Minutes: (3) All personal hearings shall be conducted by the Licensing Authority, proceedings duly minuted, and formal bench orders recorded.",
        "13. Post-Hearing Disposition and Operative Orders: The Licensing Authority may, after evaluating oral arguments, written submissions, and field verification reports:",
        "  (a) Accept compliance and exonerate the concessionaire;",
        "  (b) Grant an adjournment with specific directions for treasury reconciliation or boundary demarcations;",
        "  (c) Impose financial penalties under statutory provisions;",
        "  (d) Suspend mining operations until complete compliance; or",
        "  (e) Determine and cancel the Mining Lease (Rule 56) with forfeiture of security deposit.",
        "14. Recovery of Dues: Outstanding government royalty, penalties, and arrears shall be recoverable as arrears of land revenue."
      ]
    },
    {
      title: "RIGHT OF APPEAL & ADMINISTRATIVE REMEDIES",
      items: [
        "15. Appeals (Rule 58): Any person aggrieved by an order of the Licensing Authority under these rules may, within 30 days of communication of the order, prefer an appeal to the Appellate Authority (Secretary, Mines & Minerals Department, Government of the Punjab).",
        "16. Finality of Appellate Orders: The decision of the Appellate Authority on such appeal shall be final and binding on all parties."
      ]
    }
  ];

  // Helper to add a formatted page
  let currentPage = pdfDoc.addPage([595.28, 841.89]); // A4 Size
  let y = 800;

  const drawHeader = (page, pageNum) => {
    // Top Green Border
    page.drawRectangle({
      x: 0,
      y: 831.89,
      width: 595.28,
      height: 10,
      color: primaryColor,
    });

    // Department Header
    page.drawText("GOVERNMENT OF THE PUNJAB", {
      x: 195,
      y: 808,
      size: 11,
      font: fontBold,
      color: primaryColor,
    });

    page.drawText("MINES & MINERALS DEPARTMENT", {
      x: 200,
      y: 794,
      size: 10,
      font: fontBold,
      color: textColor,
    });

    page.drawText("PUNJAB MINING CONCESSION RULES, 2002", {
      x: 165,
      y: 778,
      size: 12,
      font: fontBold,
      color: primaryColor,
    });

    page.drawText("(Statutory Rules Governing Small Scale Mining Leases, Prospecting Licenses & Personal Hearings)", {
      x: 105,
      y: 765,
      size: 8,
      font: fontOblique,
      color: mutedColor,
    });

    // Divider Line
    page.drawLine({
      start: { x: 40, y: 755 },
      end: { x: 555, y: 755 },
      thickness: 1,
      color: primaryColor,
    });

    // Footer
    page.drawLine({
      start: { x: 40, y: 35 },
      end: { x: 555, y: 35 },
      thickness: 0.5,
      color: mutedColor,
    });

    page.drawText(`Punjab Mining Concession Rules 2002 • Official Departmental Compendium • Page ${pageNum}`, {
      x: 135,
      y: 22,
      size: 7.5,
      font: fontRegular,
      color: mutedColor,
    });
  };

  let pageNum = 1;
  drawHeader(currentPage, pageNum);
  y = 735;

  for (const section of sections) {
    if (y < 120) {
      currentPage = pdfDoc.addPage([595.28, 841.89]);
      pageNum++;
      drawHeader(currentPage, pageNum);
      y = 735;
    }

    // Section Header Box
    currentPage.drawRectangle({
      x: 40,
      y: y - 18,
      width: 515,
      height: 22,
      color: rgb(0.94, 0.97, 0.95),
      borderColor: primaryColor,
      borderWidth: 0.5,
    });

    currentPage.drawText(section.title, {
      x: 48,
      y: y - 12,
      size: 9.5,
      font: fontBold,
      color: primaryColor,
    });

    y -= 30;

    for (const item of section.items) {
      // Split long lines
      const words = item.split(' ');
      let currentLine = '';
      const lines = [];

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = fontRegular.widthOfTextAtSize(testLine, 8.5);
        if (width > 505) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      for (const line of lines) {
        if (y < 55) {
          currentPage = pdfDoc.addPage([595.28, 841.89]);
          pageNum++;
          drawHeader(currentPage, pageNum);
          y = 735;
        }

        const isHeading = line.startsWith('  (') ? false : (line.includes(':') && line.split(':')[0].length < 35);
        currentPage.drawText(line, {
          x: line.startsWith('  (') ? 55 : 45,
          y,
          size: 8.5,
          font: isHeading ? fontBold : fontRegular,
          color: textColor,
        });

        y -= 13;
      }
      y -= 4; // Gap between rules
    }
    y -= 8; // Gap between sections
  }

  // Ensure output directory exists
  const outDir = path.resolve('public', 'assets', 'docs');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(outDir, 'Punjab_Mining_Concession_Rules_2002.pdf'), pdfBytes);
  console.log(`Successfully generated Punjab Mining Concession Rules 2002 PDF at: ${path.join(outDir, 'Punjab_Mining_Concession_Rules_2002.pdf')}`);
}

generatePdf().catch(console.error);
