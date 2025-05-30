import React, { useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';

interface SummaryFormProps {
  // Removed onNext and onPrevious props
}

const SummaryForm: React.FC<SummaryFormProps> = () => {
  const { resume, dispatch } = useResume();
  const { summary, employmentHistory, skills } = resume;
  
  // New states for AI assistance
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiOptions, setShowAiOptions] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });

  // Show notification function
  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  // Handle summary change
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'UPDATE_SUMMARY',
      payload: e.target.value
    });
  };
  
  // Character count for summary
  const getCharacterCount = () => {
    return summary.length;
  };
  
  // Get character count class
  const getCharacterCountClass = () => {
    const count = getCharacterCount();
    if (count < 50) return 'text-red-500';
    if (count < 100) return 'text-yellow-500';
    if (count > 500) return 'text-red-500';
    return 'text-green-500';
  };

  // Generate AI summary based on employment history and skills
  const generateAiSummary = () => {
    setIsGeneratingAI(true);
    
    // Extract relevant information from resume data
    const recentJobs = employmentHistory.slice(0, 2);
    const topSkills = skills.sort((a, b) => b.level - a.level).slice(0, 5);

    // Calculate years of experience
    const calculateYearsOfExperience = () => {
      let totalMonths = 0;
      employmentHistory.forEach(job => {
        const startDate = job.startDate ? parseDate(job.startDate) : null;
        let endDate = job.current ? new Date() : (job.endDate ? parseDate(job.endDate) : null);
        
        if (startDate && endDate) {
          const yearDiff = endDate.getFullYear() - startDate.getFullYear();
          const monthDiff = endDate.getMonth() - startDate.getMonth();
          totalMonths += (yearDiff * 12) + monthDiff;
        }
      });
      
      const years = Math.floor(totalMonths / 12);
      return years > 0 ? `${years}+ years` : "less than a year";
    };

    // Get experience phrase
    const experiencePhrase = calculateYearsOfExperience();
    
    // Common action verbs by category
    const actionVerbs = {
      leadership: ["Led", "Managed", "Directed", "Orchestrated", "Oversaw", "Spearheaded"],
      achievement: ["Achieved", "Delivered", "Exceeded", "Improved", "Increased", "Optimized"],
      technical: ["Developed", "Engineered", "Implemented", "Programmed", "Designed", "Architected"],
      creative: ["Created", "Designed", "Conceptualized", "Crafted", "Produced", "Innovated"],
      analytical: ["Analyzed", "Evaluated", "Assessed", "Researched", "Identified", "Solved"],
      communication: ["Communicated", "Presented", "Negotiated", "Collaborated", "Consulted", "Advised"]
    };
    
    // Get random action verb from a category
    const getActionVerb = (category: keyof typeof actionVerbs) => {
      const verbs = actionVerbs[category];
      return verbs[Math.floor(Math.random() * verbs.length)];
    };
    
    // Helper to extract job type for better targeting
    const getJobType = () => {
      if (!recentJobs.length) return null;
      
      const titleLower = recentJobs[0].jobTitle.toLowerCase();
      
      if (titleLower.includes("software") || titleLower.includes("developer") || titleLower.includes("engineer") || 
          titleLower.includes("programmer") || titleLower.includes("coder")) {
        return "technical";
      } else if (titleLower.includes("manager") || titleLower.includes("director") || 
                titleLower.includes("lead") || titleLower.includes("head")) {
        return "leadership";
      } else if (titleLower.includes("designer") || titleLower.includes("creative") || 
                titleLower.includes("artist") || titleLower.includes("ux")) {
        return "creative";
      } else if (titleLower.includes("analyst") || titleLower.includes("researcher") || 
                titleLower.includes("scientist") || titleLower.includes("data")) {
        return "analytical";
      } else if (titleLower.includes("sales") || titleLower.includes("marketing") || 
                titleLower.includes("account") || titleLower.includes("consultant")) {
        return "communication";
      }
      
      return "achievement"; // Default category
    };
    
    // Get job type for verb selection
    const jobType = getJobType() || "achievement";
    
    // Parse past job description for achievements (simulated, would extract from job descriptions)
    const getAchievements = () => {
      if (!recentJobs.length) return [];
      
      // In a real implementation, this would parse the job descriptions
      // to extract quantifiable achievements using NLP
      const jobTitle = recentJobs[0].jobTitle.toLowerCase();
      
      // Default achievements by job type
      if (jobTitle.includes("software") || jobTitle.includes("developer")) {
        return ["reduced application load time by 40%", "implemented CI/CD pipelines", "increased test coverage by 60%"];
      } else if (jobTitle.includes("manager")) {
        return ["increased team productivity by 25%", "reduced turnover by 30%", "delivered projects under budget"];
      } else if (jobTitle.includes("sales")) {
        return ["exceeded sales targets by 20%", "acquired 15 new key clients", "increased revenue by 35%"];
      } else if (jobTitle.includes("marketing")) {
        return ["grew social media engagement by 45%", "launched successful campaigns", "increased conversion rates by 25%"];
      }
      
      return ["improved efficiency", "delivered projects on time", "collaborated effectively with stakeholders"];
    };
    
    // Get parsed achievements
    const achievements = getAchievements();
    
    // Industry-specific keywords based on job type
    const getIndustryKeywords = () => {
      const jobTitle = recentJobs.length > 0 ? recentJobs[0].jobTitle.toLowerCase() : "";
      
      if (jobTitle.includes("software") || jobTitle.includes("developer") || jobTitle.includes("engineer")) {
        return ["scalable solutions", "agile methodologies", "cross-platform development", "system architecture"];
      } else if (jobTitle.includes("manager") || jobTitle.includes("director")) {
        return ["strategic planning", "team leadership", "operational excellence", "stakeholder management"];
      } else if (jobTitle.includes("design") || jobTitle.includes("creative")) {
        return ["user experience", "visual communication", "brand identity", "creative direction"];
      } else if (jobTitle.includes("marketing")) {
        return ["market penetration", "brand awareness", "customer acquisition", "campaign optimization"];
      } else if (jobTitle.includes("sales")) {
        return ["revenue growth", "client relationship management", "business development", "market expansion"];
      }
      
      // Default keywords for any profession
      return ["professional expertise", "strategic thinking", "continuous improvement", "collaborative approach"];
    };
    
    const industryKeywords = getIndustryKeywords();
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Default suggestions with improved phrasing, avoiding first-person pronouns
      const defaultSuggestions = [
        `${getActionVerb(jobType)} professional with ${experiencePhrase} of experience in ${recentJobs.map(job => job.jobTitle).join(' and ')}. Strong background in ${topSkills.slice(0, 3).map(skill => skill.name).join(', ')}, with proven ability to ${achievements[0] || "deliver results"}. Seeking to leverage expertise in ${industryKeywords[0] || "the field"} to drive success in a challenging role.`,
        
        `${getActionVerb("achievement")}-driven ${recentJobs[0]?.jobTitle || "professional"} with ${experiencePhrase} experience specializing in ${topSkills.slice(0, 2).map(skill => skill.name).join(' and ')}. Demonstrated success in ${achievements[1] || "meeting objectives"} and ${industryKeywords[1] || "delivering quality work"}. Committed to ${industryKeywords[2] || "professional excellence"} and continuous knowledge expansion.`,
        
        `Seasoned ${recentJobs[0]?.jobTitle || "professional"} with ${experiencePhrase} experience and expertise in ${topSkills.slice(0, 3).map(skill => skill.name).join(', ')}. ${recentJobs.length > 0 ? `Proven track record at ${recentJobs[0]?.employer} where ${achievements[0] || "contributed significantly to organizational goals"}.` : ''} Combines strong ${jobType} skills with ${industryKeywords[3] || "effective execution"} to consistently deliver exceptional results.`
      ];
      
      // Job-specific suggestions based on most recent job title with improved quality
      const latestJob = recentJobs[0];
      if (latestJob) {
        const titleLower = latestJob.jobTitle.toLowerCase();
        
        if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('engineer')) {
          defaultSuggestions.push(
            `Innovative Software Developer with ${experiencePhrase} of specialized experience ${recentJobs.length > 1 ? 'across multiple projects' : `at ${latestJob.employer}`}. Proficient in ${topSkills.map(skill => skill.name).join(', ')}, consistently ${achievements[2] || "delivering high-quality code"}. Demonstrated expertise in creating scalable, efficient applications while staying current with emerging technologies.`
          );
        } else if (titleLower.includes('manager') || titleLower.includes('director')) {
          defaultSuggestions.push(
            `Strategic ${latestJob.jobTitle} with ${experiencePhrase} experience driving organizational success. Skilled in team leadership, project oversight, and cross-functional collaboration. Consistently ${achievements[0] || "exceeded targets"} while fostering a culture of excellence and accountability. Strong track record of ${industryKeywords[1] || "operational improvement"} and ${industryKeywords[2] || "resource optimization"}.`
          );
        } else if (titleLower.includes('designer') || titleLower.includes('creative')) {
          defaultSuggestions.push(
            `Creative professional with ${experiencePhrase} experience in design and visual communication. Specialized expertise as ${latestJob.jobTitle} at ${latestJob.employer}, with advanced skills in ${topSkills.map(skill => skill.name).join(', ')}. Passionate about creating compelling user experiences and innovative design solutions that ${achievements[0] || "resonate with target audiences"}.`
          );
        } else if (titleLower.includes('sales') || titleLower.includes('account')) {
          defaultSuggestions.push(
            `Results-oriented Sales Professional with ${experiencePhrase} experience driving revenue growth and market expansion. Demonstrated success in ${achievements[0] || "exceeding targets"} and ${achievements[1] || "building client relationships"}. Skilled in ${topSkills.map(skill => skill.name).join(', ')}, consistently delivering exceptional results through strategic ${industryKeywords[2] || "client engagement"}.`
          );
        } else if (titleLower.includes('marketing')) {
          defaultSuggestions.push(
            `Strategic Marketing Professional with ${experiencePhrase} experience in campaign development and brand growth. Proven track record of ${achievements[0] || "increasing engagement"} and ${achievements[1] || "driving conversions"}. Expert in ${topSkills.map(skill => skill.name).join(', ')}, committed to delivering data-driven marketing strategies that achieve measurable business outcomes.`
          );
        }
      }
      
      setAiSuggestions(defaultSuggestions);
      setShowAiOptions(true);
      setIsGeneratingAI(false);
    }, 800); // Simulate API latency
  };
  
  // Helper function to parse date string (MM/YYYY) to Date object
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    try {
      const [month, year] = dateStr.split('/');
      const date = new Date();
      date.setMonth(parseInt(month) - 1);
      date.setFullYear(parseInt(year));
      return date;
    } catch (error) {
      return null;
    }
  };
  
  // Apply AI suggestion
  const applySuggestion = (suggestion: string) => {
    dispatch({
      type: 'UPDATE_SUMMARY',
      payload: suggestion
    });
    setShowAiOptions(false);
  };
  
  // Improve existing summary with AI
  const improveWithAI = () => {
    if (!summary.trim()) {
      showNotification("Please add some content to your summary first.");
      return;
    }
    
    setIsGeneratingAI(true);
    
    // Extract relevant information from resume data
    const recentJobs = employmentHistory.slice(0, 2);
    const topSkills = skills.sort((a, b) => b.level - a.level).slice(0, 3);
    
    // Helper to remove first-person pronouns
    const removePronounsIfNeeded = (text: string) => {
      const pronounRegex = /\b(I|me|my|mine|myself)\b/gi;
      
      // Check if the text contains first-person pronouns
      if (pronounRegex.test(text)) {
        // Replace common first-person pronoun patterns
        return text
          .replace(/\bI am\b/gi, "")
          .replace(/\bI have\b/gi, "Has")
          .replace(/\bI possess\b/gi, "Possesses")
          .replace(/\bI achieved\b/gi, "Achieved")
          .replace(/\bI developed\b/gi, "Developed")
          .replace(/\bI created\b/gi, "Created")
          .replace(/\bI managed\b/gi, "Managed")
          .replace(/\bI led\b/gi, "Led")
          .replace(/\bI implemented\b/gi, "Implemented")
          .replace(/\bMy\b/gi, "")
          .replace(/\bI\b/gi, "")
          .replace(/\bme\b/gi, "")
          .replace(/\bmyself\b/gi, "")
          .replace(/\s+/g, " ")
          .trim();
      }
      return text;
    };
    
    // Action verbs to enhance summary
    const actionVerbs = [
      "Spearheaded", "Orchestrated", "Transformed", "Revitalized", "Pioneered",
      "Streamlined", "Cultivated", "Leveraged", "Championed", "Accelerated"
    ];
    
    // Get random action verb
    const getActionVerb = () => {
      return actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    };
    
    // Industry keywords based on job
    const getIndustryKeyword = () => {
      const jobTypes = {
        technical: ["technical solutions", "system efficiency", "software innovation", "technological advancement"],
        management: ["strategic initiatives", "operational excellence", "leadership development", "organizational growth"],
        creative: ["design thinking", "creative direction", "brand enhancement", "visual storytelling"],
        sales: ["revenue generation", "client relationship management", "market expansion", "business development"],
        general: ["productivity improvement", "quality assurance", "process optimization", "professional development"]
      };
      
      const jobType = recentJobs.length > 0 ? 
        (recentJobs[0].jobTitle.toLowerCase().includes("manager") ? "management" :
         recentJobs[0].jobTitle.toLowerCase().includes("developer") ? "technical" :
         recentJobs[0].jobTitle.toLowerCase().includes("design") ? "creative" :
         recentJobs[0].jobTitle.toLowerCase().includes("sales") ? "sales" : "general") : "general";
      
      const keywords = jobTypes[jobType as keyof typeof jobTypes];
      return keywords[Math.floor(Math.random() * keywords.length)];
    };
    
    // Simulate API call with a timeout
    setTimeout(() => {
      const currentText = summary.trim();
      // Remove first-person pronouns if present and add industry-specific enhancements
      const improvedBase = removePronounsIfNeeded(currentText);
      
      // Create three improved versions with different enhancements
      const improved1 = `${improvedBase} ${getActionVerb()} ${getIndustryKeyword()} through expertise in ${topSkills.map(skill => skill.name).join(', ')}.`;
      
      const improved2 = `${improvedBase} Demonstrated excellence in ${getIndustryKeyword()}, consistently exceeding performance expectations and delivering quantifiable results.`;
      
      const improved3 = recentJobs.length > 0 ? 
        `${improvedBase} Leverages ${topSkills.map(skill => skill.name).join(', ')} to drive ${getIndustryKeyword()} and achieve exceptional outcomes at ${recentJobs[0].employer}.` :
        `${improvedBase} Committed to professional excellence, leveraging ${topSkills.map(skill => skill.name).join(', ')} to consistently deliver outstanding results.`;
      
      setAiSuggestions([improved1, improved2, improved3]);
      setShowAiOptions(true);
      setIsGeneratingAI(false);
    }, 800);
  };

  return (
    <div className="summary-form">
      <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
      <p className="text-gray-600 mb-6">
        Write a compelling summary that highlights your key qualifications and career goals.
        This is often the first section employers read, so make it count!
      </p>
      
      <div className="mb-3">
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
          Summary
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={handleSummaryChange}
          rows={8}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Summarize your professional background, key skills, and career goals in 3-5 sentences. Focus on what makes you unique and valuable to potential employers."
        ></textarea>
        <div className={`text-xs mt-1 flex justify-between ${getCharacterCountClass()}`}>
          <span>
            {getCharacterCount()} characters
            {getCharacterCount() < 100 && " (aim for 100-500 characters)"}
          </span>
          <span>
            {getCharacterCount() > 500 && "Consider shortening your summary"}
          </span>
        </div>
      </div>

      {/* AI assistance buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          type="button"
          onClick={generateAiSummary}
          disabled={isGeneratingAI}
          className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
        >
          {isGeneratingAI ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Generate with AI
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={improveWithAI}
          disabled={isGeneratingAI || !summary.trim()}
          className="px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center disabled:opacity-50"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
          </svg>
          Improve with AI
        </button>
      </div>
      
      {/* AI suggestions */}
      {showAiOptions && (
        <div className="mb-6 p-4 border border-blue-200 rounded-md bg-blue-50">
          <h3 className="text-sm font-medium text-blue-800 mb-2">AI Suggestions:</h3>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-white border border-blue-100 rounded-md">
                <p className="text-sm text-gray-700 mb-2">{suggestion}</p>
                <button
                  onClick={() => applySuggestion(suggestion)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Use this suggestion
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Notification */}
      {notification.visible && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 opacity-100">
          {notification.message}
        </div>
      )}
      
      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Pro Tips:</h3>
        <ul className="text-sm text-blue-700 list-disc pl-5">
          <li>Keep your summary concise and focused on your most relevant qualifications</li>
          <li>Tailor it to match the requirements of the job you're applying for</li>
          <li>Include your years of experience, key skills, and notable achievements</li>
          <li>Avoid using first-person pronouns (I, me, my)</li>
          <li>Use strong action verbs and industry-specific keywords</li>
        </ul>
      </div>
      
      <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Example Summary:</h3>
        <p className="text-sm text-gray-600 italic">
          "Results-driven Software Engineer with 5+ years of experience developing web applications using JavaScript, React, and Node.js. Proven track record of delivering high-quality code on time and under budget. Passionate about creating intuitive user experiences and optimizing application performance. Seeking to leverage technical expertise and leadership skills to drive innovation at a forward-thinking tech company."
        </p>
      </div>
    </div>
  );
};

export default SummaryForm;