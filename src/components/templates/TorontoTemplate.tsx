import React from 'react';
import { TemplateProps } from '../../types/template';

// Toronto template component
export const TorontoTemplate: React.FC<TemplateProps> = ({ resume, scale = 1 }) => {
  const { personalDetails, summary, employmentHistory, education, skills, accentColor,
    certifications, projects, internships, hobbies, languages, customSections } = resume;
  
  // Use accent color with a fallback
  const themeColor = accentColor || '#2563eb';
  
  return (
    <div 
      className="toronto-template" 
      style={{ 
        fontFamily: resume.fontSettings?.primary || 'Inter, Arial, sans-serif',
        color: '#1f2937',
        maxWidth: `${8.5 * scale}in`,
        minHeight: `${11 * scale}in`,
        padding: `${0.75 * scale}in`,
        boxSizing: 'border-box',
        border: '1px solid #f3f4f6',
        backgroundColor: 'white',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: `${0.4 * scale}in`,
        lineHeight: resume.fontSettings?.spacing ? `${resume.fontSettings.spacing}%` : '100%',
      }}
    >
      {/* Header */}
      <header style={{ 
        borderBottom: `1px solid ${themeColor}`,
        paddingBottom: `${0.3 * scale}in`,
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <h1 style={{ 
            fontSize: `${20 * scale}px`, 
            fontWeight: 700,
            marginBottom: `${0.1 * scale}in`,
            letterSpacing: '-0.025em',
            color: themeColor
          }}>
            {personalDetails.firstName} {personalDetails.lastName}
          </h1>
          
          {personalDetails.jobTitle && (
            <h2 style={{ 
              fontSize: `${14 * scale}px`,
              fontWeight: 500,
              marginBottom: `${0.15 * scale}in`,
              color: '#4b5563'
            }}>
              {personalDetails.jobTitle}
            </h2>
          )}

          {/* Contact section */}
          <div style={{ 
            display: 'flex', 
            gap: `${0.4 * scale}in`,
            fontSize: `${9 * scale}px`,
            color: '#6b7280'
          }}>
            {personalDetails.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: `${0.1 * scale}in` }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill={themeColor}
                  style={{ width: `${10 * scale}px`, height: `${10 * scale}px` }}
                >
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
                <span>{personalDetails.email}</span>
              </div>
            )}
            
            {personalDetails.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: `${0.1 * scale}in` }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill={themeColor}
                  style={{ width: `${10 * scale}px`, height: `${10 * scale}px` }}
                >
                  <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                </svg>
                <span>{personalDetails.phone}</span>
              </div>
            )}
            
            {personalDetails.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: `${0.1 * scale}in` }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill={themeColor}
                  style={{ width: `${10 * scale}px`, height: `${10 * scale}px` }}
                >
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                </svg>
                <span>
                  {personalDetails.address}
                  {(personalDetails.city || personalDetails.country) && <br />}
                  {personalDetails.city && personalDetails.city}
                  {personalDetails.city && personalDetails.country && ', '}
                  {personalDetails.country && personalDetails.country}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Photo if available */}
        {personalDetails.photo && (
          <div style={{ 
            width: `${1.2 * scale}in`,
            height: `${1.2 * scale}in`,
            borderRadius: `${0.1 * scale}in`,
            overflow: 'hidden',
            marginLeft: `${0.3 * scale}in`,
            border: `2px solid ${themeColor}`,
          }}>
            <img 
              src={personalDetails.photo} 
              alt={`${personalDetails.firstName} ${personalDetails.lastName}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.45 * scale}in` }}>
        {/* Summary */}
        {summary && (
          <section>
            <h3 style={{ 
              fontSize: `${12 * scale}px`, 
              fontWeight: 600,
              marginBottom: `${0.15 * scale}in`,
              color: themeColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${themeColor}25`, // 25% opacity
              paddingBottom: `${0.05 * scale}in`,
            }}>
              Professional Summary
            </h3>
            <p style={{ 
              fontSize: `${10 * scale}px`, 
              lineHeight: 1.6,
              color: '#4b5563'
            }}>
              {summary}
            </p>
          </section>
        )}

        {/* Employment History */}
        {employmentHistory.length > 0 && (
          <section>
            <h3 style={{ 
              fontSize: `${12 * scale}px`, 
              fontWeight: 600,
              marginBottom: `${0.2 * scale}in`,
              color: themeColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${themeColor}25`, // 25% opacity
              paddingBottom: `${0.05 * scale}in`,
            }}>
              Employment History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.3 * scale}in` }}>
              {employmentHistory.map((job) => (
                <div key={job.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${0.05 * scale}in` }}>
                    <h4 style={{ 
                      fontSize: `${11 * scale}px`, 
                      fontWeight: 600,
                      margin: 0,
                      color: themeColor
                    }}>
                      {job.jobTitle}
                    </h4>
                    <span style={{ 
                      fontSize: `${9 * scale}px`, 
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      {job.startDate} - {job.current ? 'Present' : job.endDate}
                    </span>
                  </div>
                  <h5 style={{ 
                    fontSize: `${10 * scale}px`, 
                    fontWeight: 500,
                    marginBottom: `${0.1 * scale}in`,
                    color: '#4b5563'
                  }}>
                    {job.employer}{job.city ? `, ${job.city}` : ''}
                  </h5>
                  <div style={{ 
                    fontSize: `${10 * scale}px`, 
                    lineHeight: 1.6,
                    color: '#4b5563',
                    margin: 0
                  }}>
                    <div dangerouslySetInnerHTML={{ __html: job.description }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h3 style={{ 
              fontSize: `${12 * scale}px`, 
              fontWeight: 600,
              marginBottom: `${0.2 * scale}in`,
              color: themeColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${themeColor}25`, // 25% opacity
              paddingBottom: `${0.05 * scale}in`,
            }}>
              Education
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.3 * scale}in` }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${0.05 * scale}in` }}>
                    <h4 style={{ 
                      fontSize: `${11 * scale}px`, 
                      fontWeight: 600,
                      margin: 0,
                      color: themeColor
                    }}>
                      {edu.degree}
                    </h4>
                    <span style={{ 
                      fontSize: `${9 * scale}px`, 
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                  <h5 style={{ 
                    fontSize: `${10 * scale}px`, 
                    fontWeight: 500,
                    marginBottom: `${0.1 * scale}in`,
                    color: '#4b5563'
                  }}>
                    {edu.school}
                  </h5>
                  {edu.description && (
                    <div style={{ 
                      fontSize: `${10 * scale}px`, 
                      lineHeight: 1.6,
                      color: '#4b5563',
                      margin: 0
                    }}>
                      <div dangerouslySetInnerHTML={{ __html: edu.description }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3 style={{ 
              fontSize: `${12 * scale}px`, 
              fontWeight: 600,
              marginBottom: `${0.2 * scale}in`,
              color: themeColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${themeColor}25`, // 25% opacity
              paddingBottom: `${0.05 * scale}in`,
            }}>
              Skills
            </h3>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: `${0.1 * scale}in ${0.15 * scale}in`
            }}>
              {skills.map((skill) => (
                <div key={skill.id} style={{
                  fontSize: `${9 * scale}px`,
                  padding: `${0.05 * scale}in ${0.1 * scale}in`,
                  backgroundColor: `${themeColor}10`, // 10% opacity
                  color: themeColor,
                  fontWeight: 500,
                  borderRadius: `${0.05 * scale}in`,
                }}>
                  {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <h3 style={{ 
              fontSize: `${12 * scale}px`, 
              fontWeight: 600,
              marginBottom: `${0.2 * scale}in`,
              color: themeColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${themeColor}25`, // 25% opacity
              paddingBottom: `${0.05 * scale}in`,
            }}>
              Certifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.3 * scale}in` }}>
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${0.05 * scale}in` }}>
                    <h4 style={{ 
                      fontSize: `${11 * scale}px`, 
                      fontWeight: 600,
                      margin: 0,
                      color: themeColor
                    }}>
                      {cert.name}
                    </h4>
                    {cert.date && (
                      <span style={{ 
                        fontSize: `${9 * scale}px`, 
                        color: '#6b7280',
                        fontWeight: 500
                      }}>
                        {cert.date}
                      </span>
                    )}
                  </div>
                  <h5 style={{ 
                    fontSize: `${10 * scale}px`, 
                    fontWeight: 500,
                    marginBottom: `${0.1 * scale}in`,
                    color: '#4b5563'
                  }}>
                    {cert.institution}
                  </h5>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h3 style={{ 
              fontSize: `${12 * scale}px`, 
              fontWeight: 600,
              marginBottom: `${0.2 * scale}in`,
              color: themeColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${themeColor}25`, // 25% opacity
              paddingBottom: `${0.05 * scale}in`,
            }}>
              Projects
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.3 * scale}in` }}>
              {projects.map((project) => (
                <div key={project.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${0.05 * scale}in` }}>
                    <h4 style={{ 
                      fontSize: `${11 * scale}px`, 
                      fontWeight: 600,
                      margin: 0,
                      color: themeColor
                    }}>
                      {project.name}
                    </h4>
                    <span style={{ 
                      fontSize: `${9 * scale}px`, 
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      {project.startDate} - {project.endDate || 'Present'}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: `${10 * scale}px`, 
                    lineHeight: 1.6,
                    color: '#4b5563',
                    margin: 0
                  }}>
                    <div dangerouslySetInnerHTML={{ __html: project.description }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Internships */}
        {internships && internships.length > 0 && (
          <section>
            <h3 style={{ 
              fontSize: `${12 * scale}px`, 
              fontWeight: 600,
              marginBottom: `${0.2 * scale}in`,
              color: themeColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${themeColor}25`, // 25% opacity
              paddingBottom: `${0.05 * scale}in`,
            }}>
              Internships
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.3 * scale}in` }}>
              {internships.map((internship) => (
                <div key={internship.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${0.05 * scale}in` }}>
                    <h4 style={{ 
                      fontSize: `${11 * scale}px`, 
                      fontWeight: 600,
                      margin: 0,
                      color: themeColor
                    }}>
                      {internship.position}
                    </h4>
                    <span style={{ 
                      fontSize: `${9 * scale}px`, 
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      {internship.startDate} - {internship.endDate || 'Present'}
                    </span>
                  </div>
                  <h5 style={{ 
                    fontSize: `${10 * scale}px`, 
                    fontWeight: 500,
                    marginBottom: `${0.1 * scale}in`,
                    color: '#4b5563'
                  }}>
                    {internship.company}
                  </h5>
                  <div style={{ 
                    fontSize: `${10 * scale}px`, 
                    lineHeight: 1.6,
                    color: '#4b5563',
                    margin: 0
                  }}>
                    <div dangerouslySetInnerHTML={{ __html: internship.description }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Languages */}
        {languages && languages.length > 0 && (
          <section>
            <h3 style={{ 
              fontSize: `${12 * scale}px`, 
              fontWeight: 600,
              marginBottom: `${0.2 * scale}in`,
              color: themeColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${themeColor}25`, // 25% opacity
              paddingBottom: `${0.05 * scale}in`,
            }}>
              Languages
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${0.3 * scale}in ${0.6 * scale}in` }}>
              {languages.map((language) => (
                <div key={language.id} style={{ minWidth: `${1.5 * scale}in` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ 
                      fontSize: `${10 * scale}px`, 
                      fontWeight: 600,
                      margin: 0,
                      color: themeColor
                    }}>
                      {language.name}
                    </h4>
                    <span style={{ 
                      fontSize: `${9 * scale}px`, 
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      {language.proficiency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Hobbies */}
        {hobbies && hobbies.length > 0 && (
          <section>
            <h3 style={{ 
              fontSize: `${12 * scale}px`, 
              fontWeight: 600,
              marginBottom: `${0.2 * scale}in`,
              color: themeColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${themeColor}25`, // 25% opacity
              paddingBottom: `${0.05 * scale}in`,
            }}>
              Hobbies
            </h3>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: `${0.1 * scale}in ${0.15 * scale}in`
            }}>
              {hobbies.map((hobby) => (
                <div key={hobby.id} style={{
                  fontSize: `${9 * scale}px`,
                  padding: `${0.05 * scale}in ${0.1 * scale}in`,
                  backgroundColor: `${themeColor}10`, // 10% opacity
                  color: themeColor,
                  fontWeight: 500,
                  borderRadius: `${0.05 * scale}in`,
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
            <section key={section.id}>
              <h3 style={{ 
                fontSize: `${12 * scale}px`, 
                fontWeight: 600,
                marginBottom: `${0.2 * scale}in`,
                color: themeColor,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: `1px solid ${themeColor}25`, // 25% opacity
                paddingBottom: `${0.05 * scale}in`,
              }}>
                {section.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.2 * scale}in` }}>
                {section.items.map((item, index) => (
                  <div key={index}>
                    {item.title && (
                      <h4 style={{ 
                        fontSize: `${11 * scale}px`, 
                        fontWeight: 600,
                        margin: 0,
                        marginBottom: `${0.05 * scale}in`,
                        color: themeColor
                      }}>
                        {item.title}
                      </h4>
                    )}
                    <div style={{ 
                      fontSize: `${10 * scale}px`, 
                      lineHeight: 1.6,
                      color: '#4b5563',
                      margin: 0
                    }}>
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

export default TorontoTemplate;