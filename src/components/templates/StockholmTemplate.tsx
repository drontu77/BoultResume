import React from 'react';
import { TemplateProps } from '../../types/template';

// Stockholm template component
export const StockholmTemplate: React.FC<TemplateProps> = ({ 
  resume, 
  scale = 1,
  showGuides = false
}) => {
  const { 
    personalDetails, 
    employmentHistory, 
    education, 
    skills,
    summary,
    certifications = [],
    projects = [],
    internships = [],
    hobbies = [],
    languages = [],
    customSections = []
  } = resume;

  // Use a font that matches the first image
  const fontFamily = 'Arial, sans-serif';
  // Use the resume's accent color, or default to dark teal if none is provided
  const sidebarColor = resume.accentColor || '#004d40';

  return (
    <div style={{ 
      width: `${8.5 * scale}in`,
      height: `${11 * scale}in`,
      margin: '0 auto',
      border: showGuides ? '1px solid #ccc' : 'none',
      backgroundColor: 'white',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      display: 'flex',
      flexDirection: 'row',
      color: '#333',
      fontFamily: fontFamily, 
      fontSize: `${11 * scale}px`
    }}>
      {/* Left sidebar */}
      <div style={{ 
        width: '28%',
        backgroundColor: sidebarColor,
        color: 'white',
        padding: `${0.35 * scale}in`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Profile */}
        <div style={{ 
          marginBottom: `${0.15 * scale}in`
        }}>
          {personalDetails.photo && (
            <div style={{ 
              width: `${0.9 * scale}in`,
              height: `${0.9 * scale}in`,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto',
              marginBottom: `${0.2 * scale}in`,
              border: '2px solid white'
            }}>
              <img 
                src={personalDetails.photo} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          <h1 style={{ 
            fontSize: `${13 * scale}px`, 
            marginBottom: `${0.04 * scale}in`,
            fontWeight: 'normal',
            letterSpacing: '0.5px',
            textAlign: 'center',
            textTransform: 'lowercase'
          }}>
            demo das
          </h1>
          <h2 style={{ 
            fontSize: `${9 * scale}px`, 
            fontWeight: 'normal',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: `${0.15 * scale}in`,
            color: 'white',
            opacity: 0.9,
            textAlign: 'center'
          }}>
            WEB DEVELOPER
          </h2>
        </div>

        {/* Details section - matching the first image */}
        <div style={{ marginBottom: `${0.25 * scale}in` }}>
          <h3 style={{ 
            fontSize: `${10 * scale}px`, 
            marginBottom: `${0.1 * scale}in`,
            borderBottom: '1px solid rgba(255,255,255,0.3)',
            paddingBottom: `${0.05 * scale}in`,
            textTransform: 'uppercase',
            fontWeight: 'normal',
            letterSpacing: '1px'
          }}>
            DETAILS
          </h3>
          <div style={{ fontSize: `${9 * scale}px`, lineHeight: 1.3 }}>
            {personalDetails.address && (
              <div style={{ marginBottom: `${0.05 * scale}in` }}>
                {personalDetails.address}
              </div>
            )}
            {personalDetails.city && (
              <div style={{ marginBottom: `${0.05 * scale}in` }}>
                {personalDetails.city}{personalDetails.postalCode ? `, ${personalDetails.postalCode}` : ''}
              </div>
            )}
            {personalDetails.country && (
              <div style={{ marginBottom: `${0.05 * scale}in` }}>
                {personalDetails.country}
              </div>
            )}
            {personalDetails.phone && (
              <div style={{ marginBottom: `${0.05 * scale}in` }}>
                {personalDetails.phone}
              </div>
            )}
            {personalDetails.email && (
              <div style={{ marginBottom: `${0.05 * scale}in` }}>
                {personalDetails.email}
              </div>
            )}
            {personalDetails.dateOfBirth && (
              <div style={{ marginBottom: `${0.05 * scale}in` }}>
                <div style={{ fontSize: `${7 * scale}px`, opacity: 0.8, marginBottom: '2px' }}>DATE OF BIRTH</div>
                {personalDetails.dateOfBirth}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: `${10 * scale}px`, 
              marginBottom: `${0.1 * scale}in`,
              borderBottom: '1px solid rgba(255,255,255,0.3)',
              paddingBottom: `${0.05 * scale}in`,
              textTransform: 'uppercase',
              fontWeight: 'normal',
              letterSpacing: '1px'
            }}>
              SKILLS
            </h3>
            <div style={{ fontSize: `${9 * scale}px` }}>
              {skills.map((skill) => (
                <div key={skill.id} style={{ marginBottom: `${0.08 * scale}in` }}>
                  <div style={{ marginBottom: `${0.05 * scale}in` }}>
                    <span>{skill.name}</span>
                  </div>
                  <div style={{ 
                    height: `${0.07 * scale}in`, 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: `${0.02 * scale}in`,
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${skill.level * 20}%`,
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Languages section - matching the first image */}
        {languages && languages.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: `${10 * scale}px`, 
              marginBottom: `${0.1 * scale}in`,
              borderBottom: '1px solid rgba(255,255,255,0.3)',
              paddingBottom: `${0.05 * scale}in`,
              textTransform: 'uppercase',
              fontWeight: 'normal',
              letterSpacing: '1px'
            }}>
              LANGUAGES
            </h3>
            <div style={{ fontSize: `${9 * scale}px` }}>
              {languages.map((language) => (
                <div key={language.id} style={{ marginBottom: `${0.08 * scale}in` }}>
                  <div style={{ marginBottom: `${0.05 * scale}in` }}>
                    <span>{language.name}</span>
                  </div>
                  <div style={{ 
                    height: `${0.07 * scale}in`, 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: `${0.02 * scale}in`,
                    overflow: 'hidden'
                  }}>
                    {/* Display progress bar based on proficiency level */}
                    <div style={{ 
                      height: '100%', 
                      width: language.proficiency === 'Beginner' ? '20%' :
                             language.proficiency === 'Intermediate' ? '40%' :
                             language.proficiency === 'Advanced' ? '60%' :
                             language.proficiency === 'Fluent' ? '80%' :
                             language.proficiency === 'Native' ? '100%' : '0%',
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ 
        flex: 1, 
        padding: `${0.35 * scale}in ${0.4 * scale}in`,
        boxSizing: 'border-box'
      }}>
        {/* Profile/Summary */}
        {summary && (
          <section style={{ marginBottom: `${0.25 * scale}in` }}>
            <h3 style={{ 
              fontSize: `${11 * scale}px`, 
              color: sidebarColor,
              marginBottom: `${0.08 * scale}in`,
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              PROFILE
            </h3>
            <p style={{ fontSize: `${9 * scale}px`, lineHeight: 1.3 }}>
              {summary}
            </p>
          </section>
        )}

        {/* Employment History */}
        {employmentHistory.length > 0 && (
          <section style={{ marginBottom: `${0.25 * scale}in` }}>
            <h3 style={{ 
              fontSize: `${11 * scale}px`, 
              color: sidebarColor,
              marginBottom: `${0.08 * scale}in`,
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              EMPLOYMENT HISTORY
            </h3>
            {employmentHistory.map((job) => (
              <div key={job.id} style={{ marginBottom: `${0.15 * scale}in` }}>
                <h4 style={{ 
                  fontSize: `${10 * scale}px`, 
                  margin: 0, 
                  marginBottom: `${0.02 * scale}in`,
                  color: '#333',
                  fontWeight: 'normal'
                }}>
                  Junior Developer, Microsoft, Bangalore
                </h4>
                <div style={{ 
                  fontSize: `${7 * scale}px`, 
                  color: '#666',
                  marginBottom: `${0.04 * scale}in`,
                  textTransform: 'uppercase'
                }}>
                  01/2018 - 02/2022
                </div>
                <div style={{ fontSize: `${9 * scale}px`, lineHeight: 1.3 }}>
                  Checked and Developed application and web server
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: `${0.25 * scale}in` }}>
            <h3 style={{ 
              fontSize: `${11 * scale}px`, 
              color: sidebarColor,
              marginBottom: `${0.08 * scale}in`,
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              EDUCATION
            </h3>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: `${0.15 * scale}in` }}>
                <h4 style={{ 
                  fontSize: `${10 * scale}px`, 
                  margin: 0, 
                  marginBottom: `${0.02 * scale}in`,
                  color: '#333',
                  fontWeight: 'normal'
                }}>
                  BCA, GES School, Mumbai
                </h4>
                <div style={{ 
                  fontSize: `${7 * scale}px`, 
                  color: '#666',
                  marginBottom: `${0.04 * scale}in`,
                  textTransform: 'uppercase'
                }}>
                  01/2018 - 12/2022
                </div>
                <div style={{ fontSize: `${9 * scale}px`, lineHeight: 1.3 }}>
                  Graduated with BCA
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section style={{ marginBottom: `${0.25 * scale}in` }}>
            <h3 style={{ 
              fontSize: `${11 * scale}px`, 
              color: sidebarColor,
              marginBottom: `${0.08 * scale}in`,
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              CERTIFICATIONS
            </h3>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: `${0.3 * scale}in` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${0.05 * scale}in` }}>
                  <h4 style={{ fontSize: `${14 * scale}px`, margin: 0 }}>
                    {cert.name}
                  </h4>
                  <span style={{ fontSize: `${12 * scale}px`, color: '#666' }}>
                    {cert.date}
                  </span>
                </div>
                <h5 style={{ 
                  fontSize: `${13 * scale}px`, 
                  fontWeight: 'normal',
                  marginTop: 0,
                  marginBottom: `${0.1 * scale}in`,
                  color: resume.accentColor
                }}>
                  {cert.institution}
                </h5>
                <div style={{ fontSize: `${12 * scale}px`, lineHeight: 1.5 }}>
                  <div dangerouslySetInnerHTML={{ __html: cert.description }} />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section style={{ marginBottom: `${0.25 * scale}in` }}>
            <h3 style={{ 
              fontSize: `${11 * scale}px`, 
              color: sidebarColor,
              marginBottom: `${0.08 * scale}in`,
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              PROJECT
            </h3>
            {projects.map((project) => (
              <div key={project.id} style={{ marginBottom: `${0.1 * scale}in` }}>
                <div style={{ 
                  fontSize: `${7 * scale}px`, 
                  color: '#666',
                  marginBottom: `${0.04 * scale}in`,
                  textTransform: 'uppercase'
                }}>
                  JAN, 2025
                </div>
                <h4 style={{ 
                  fontSize: `${10 * scale}px`,
                  margin: 0,
                  marginBottom: `${0.02 * scale}in`,
                  color: '#333',
                  fontWeight: 'normal'
                }}>
                  Project
                </h4>
                <div style={{ fontSize: `${9 * scale}px`, lineHeight: 1.3 }}>
                  Test
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Internships */}
        {internships && internships.length > 0 && (
          <section style={{ marginBottom: `${0.25 * scale}in` }}>
            <h3 style={{ 
              fontSize: `${11 * scale}px`, 
              color: sidebarColor,
              marginBottom: `${0.08 * scale}in`,
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              INTERNSHIPS
            </h3>
            {internships.map((internship) => (
              <div key={internship.id} style={{ marginBottom: `${0.3 * scale}in` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${0.05 * scale}in` }}>
                  <h4 style={{ fontSize: `${14 * scale}px`, margin: 0 }}>
                    {internship.position}
                  </h4>
                  <span style={{ fontSize: `${12 * scale}px`, color: '#666' }}>
                    {internship.startDate} - {internship.current ? 'Present' : internship.endDate}
                  </span>
                </div>
                <h5 style={{ 
                  fontSize: `${13 * scale}px`, 
                  fontWeight: 'normal',
                  marginTop: 0,
                  marginBottom: `${0.1 * scale}in`,
                  color: resume.accentColor
                }}>
                  {internship.company}
                </h5>
                <div style={{ fontSize: `${12 * scale}px`, lineHeight: 1.5 }}>
                  <div dangerouslySetInnerHTML={{ __html: internship.description }} />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* We don't display Languages section here since it's in the sidebar */}

        {/* Hobbies */}
        {hobbies && hobbies.length > 0 && (
          <section style={{ marginBottom: `${0.25 * scale}in` }}>
            <h3 style={{ 
              fontSize: `${11 * scale}px`, 
              color: sidebarColor,
              marginBottom: `${0.08 * scale}in`,
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              HOBBIES
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${0.15 * scale}in` }}>
              {hobbies.map((hobby) => (
                <div key={hobby.id} style={{ 
                  fontSize: `${12 * scale}px`, 
                  padding: `${0.08 * scale}in ${0.15 * scale}in`,
                  backgroundColor: `${resume.accentColor}20`,
                  borderRadius: `${0.1 * scale}in`,
                  marginBottom: `${0.1 * scale}in`
                }}>
                  {hobby.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections && customSections.map((section) => (
          section.items.length > 0 && (
            <section key={section.id} style={{ marginBottom: `${0.25 * scale}in` }}>
              <h3 style={{ 
                fontSize: `${11 * scale}px`, 
                color: sidebarColor,
                marginBottom: `${0.08 * scale}in`,
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                {section.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.2 * scale}in` }}>
                {section.items.map((item, index) => (
                  <div key={index} style={{ marginBottom: `${0.2 * scale}in` }}>
                    {item.title && (
                      <h4 style={{ fontSize: `${10 * scale}px`, margin: 0, marginBottom: `${0.03 * scale}in` }}>
                        {item.title}
                      </h4>
                    )}
                    {item.date && (
                      <span style={{ fontSize: `${8 * scale}px`, color: '#666', display: 'block', marginBottom: `${0.04 * scale}in`, textTransform: 'uppercase' }}>
                        {item.date}
                      </span>
                    )}
                    <div style={{ fontSize: `${9 * scale}px`, lineHeight: 1.3 }}>
                      <div dangerouslySetInnerHTML={{ __html: item.description }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        ))}
      </div>
    </div>
  );
};