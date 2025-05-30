// No need for React import in this service file
import { Resume } from '../types/resume';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

// PDF export function (would use a library like react-pdf in a real implementation)
export const exportToPDF = (resume: Resume) => {
  // In a real implementation, this would use react-pdf or similar library
  // For now, we'll just create a mock function that would trigger a download
  
  console.log('Exporting resume to PDF:', resume);
  
  // Create a mock download link
  const link = document.createElement('a');
  link.href = '#';
  link.download = `${resume.personalDetails.firstName}_${resume.personalDetails.lastName}_Resume.pdf`;
  link.onclick = () => {
    alert('PDF export functionality would be implemented with a library like react-pdf');
    return false;
  };
  link.click();
};

// DOCX export function
export const exportToDOCX = async (resume: Resume) => {
  // Create a new document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header with name and job title
          new Paragraph({
            text: `${resume.personalDetails.firstName} ${resume.personalDetails.lastName}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: resume.personalDetails.jobTitle,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          
          // Contact information
          new Paragraph({
            children: [
              new TextRun({ text: 'Contact: ', bold: true }),
              new TextRun(`${resume.personalDetails.email} | ${resume.personalDetails.phone}`),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          // Address
          new Paragraph({
            children: [
              new TextRun(`${resume.personalDetails.address}, ${resume.personalDetails.city}, ${resume.personalDetails.country}`),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          // Summary
          new Paragraph({
            text: 'Professional Summary',
            heading: HeadingLevel.HEADING_3,
            thematicBreak: true,
          }),
          new Paragraph({
            text: resume.summary,
          }),
          
          // Employment History
          new Paragraph({
            text: 'Employment History',
            heading: HeadingLevel.HEADING_3,
            thematicBreak: true,
          }),
          
          // Add each job
          ...resume.employmentHistory.flatMap(job => [
            new Paragraph({
              text: job.jobTitle,
              heading: HeadingLevel.HEADING_4,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${job.employer} | `, bold: true }),
                new TextRun(`${job.startDate} - ${job.current ? 'Present' : job.endDate}`),
              ],
            }),
            new Paragraph({
              text: job.description,
            }),
          ]),
          
          // Education
          new Paragraph({
            text: 'Education',
            heading: HeadingLevel.HEADING_3,
            thematicBreak: true,
          }),
          
          // Add each education
          ...resume.education.flatMap(edu => [
            new Paragraph({
              text: edu.degree,
              heading: HeadingLevel.HEADING_4,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${edu.school} | `, bold: true }),
                new TextRun(`${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`),
              ],
            }),
            new Paragraph({
              text: edu.description,
            }),
          ]),
          
          // Skills
          new Paragraph({
            text: 'Skills',
            heading: HeadingLevel.HEADING_3,
            thematicBreak: true,
          }),
          new Paragraph({
            children: resume.skills.map(skill => 
              new TextRun({ text: `${skill.name}, ` })
            ),
          }),
        ],
      },
    ],
  });

  // Generate the document
  const blob = await Packer.toBlob(doc);
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resume.personalDetails.firstName}_${resume.personalDetails.lastName}_Resume.docx`;
  link.click();
};

// TXT export function
export const exportToTXT = (resume: Resume) => {
  // Create a simple text version of the resume
  let content = `${resume.personalDetails.firstName} ${resume.personalDetails.lastName}\n`;
  content += `${resume.personalDetails.jobTitle}\n\n`;
  content += `Contact: ${resume.personalDetails.email} | ${resume.personalDetails.phone}\n`;
  content += `Address: ${resume.personalDetails.address}, ${resume.personalDetails.city}, ${resume.personalDetails.country}\n\n`;
  
  // Summary
  content += `PROFESSIONAL SUMMARY\n`;
  content += `${resume.summary}\n\n`;
  
  // Employment History
  content += `EMPLOYMENT HISTORY\n`;
  resume.employmentHistory.forEach(job => {
    content += `${job.jobTitle}\n`;
    content += `${job.employer} | ${job.startDate} - ${job.current ? 'Present' : job.endDate}\n`;
    content += `${job.description}\n\n`;
  });
  
  // Education
  content += `EDUCATION\n`;
  resume.education.forEach(edu => {
    content += `${edu.degree}\n`;
    content += `${edu.school} | ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}\n`;
    content += `${edu.description}\n\n`;
  });
  
  // Skills
  content += `SKILLS\n`;
  content += resume.skills.map(skill => skill.name).join(', ');
  
  // Create download link
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resume.personalDetails.firstName}_${resume.personalDetails.lastName}_Resume.txt`;
  link.click();
};