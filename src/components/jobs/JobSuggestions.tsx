import React, { useState, useEffect, useCallback } from 'react';

interface JobSuggestionsProps {
  jobTitle?: string;
  location?: string;
  city?: string;
  country?: string;
}

interface JobCard {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  description: string;
  url: string;
  logoUrl: string;
  daysAgo: number;
  liked?: boolean;
}

const JobSuggestions: React.FC<JobSuggestionsProps> = ({ 
  jobTitle = '', 
  location = '', 
  city = '', 
  country = '' 
}) => {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasRequiredData, setHasRequiredData] = useState(false);

  // Helper function to build location string from available data
  const getLocationString = useCallback(() => {
    const locationParts = [];
    if (city?.trim()) locationParts.push(city.trim());
    if (country?.trim()) locationParts.push(country.trim());
    
    return location?.trim() ? location.trim() : locationParts.join(', ');
  }, [location, city, country]);
  
  // Helper function to build LinkedIn URL - used for 'View All Jobs' link
  const buildLinkedInUrl = useCallback((title: string, locationStr: string) => {
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title || '')}&location=${encodeURIComponent(locationStr || '')}`;
  }, []);
  
  useEffect(() => {
    const hasTitle = Boolean(jobTitle?.trim());
    const hasLocation = Boolean(
      location?.trim() || city?.trim() || country?.trim()
    );
    
    console.log('Job Suggestions Data:', { jobTitle, location, city, country, hasTitle, hasLocation });
    
    setHasRequiredData(hasTitle && hasLocation);
    
    if (hasTitle && hasLocation) {
      generateJobSuggestions();
    }
  }, [jobTitle, location, city, country]);

  // Helper function to get location-specific details
  const getLocationDetails = useCallback((userLocation: string) => {
    // Normalize user location for matching
    const normalizedLocation = userLocation.toLowerCase();
    
    // Define location-based job possibilities
    const locationMap: Record<string, {cities: string[], companies: string[]}> = {
      'india': {
        cities: ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune'],
        companies: ['Tata Consultancy Services', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra']
      },
      'usa': {
        cities: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Boston'],
        companies: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta']
      },
      'uk': {
        cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Edinburgh'],
        companies: ['BP', 'HSBC', 'Vodafone', 'Barclays', 'GSK']
      },
      'australia': {
        cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
        companies: ['Telstra', 'Commonwealth Bank', 'BHP', 'Atlassian', 'Westpac']
      },
      'canada': {
        cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
        companies: ['Shopify', 'Royal Bank of Canada', 'TD Bank', 'Constellation Software', 'CGI Group']
      },
      'germany': {
        cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
        companies: ['SAP', 'Siemens', 'Allianz', 'Deutsche Bank', 'BMW']
      },
      'france': {
        cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
        companies: ['Total', 'BNP Paribas', 'AXA', 'L\'Oréal', 'Danone']
      },
      'japan': {
        cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'],
        companies: ['Toyota', 'Sony', 'SoftBank', 'Hitachi', 'Nintendo']
      },
      'singapore': {
        cities: ['Singapore Central', 'Jurong', 'Tampines', 'Woodlands', 'Punggol'],
        companies: ['DBS Bank', 'Singtel', 'United Overseas Bank', 'Grab', 'Sea Limited']
      }
    };
    
    // Default location if no match found
    let matchedLocation = {
      cities: ['New York', 'London', 'Singapore', 'Tokyo', 'Sydney'],
      companies: ['Global Innovations', 'International Tech', 'WorldWide Solutions', 'Universal Enterprises', 'Momentum Inc']
    };
    
    // Match by country name
    for (const [key, value] of Object.entries(locationMap)) {
      if (normalizedLocation.includes(key)) {
        matchedLocation = value;
        break;
      }
    }
    
    // Try to match by city name as fallback
    if (matchedLocation === locationMap.usa) {
      for (const [, value] of Object.entries(locationMap)) {
        if (value.cities.some(city => normalizedLocation.includes(city.toLowerCase()))) {
          matchedLocation = value;
          break;
        }
      }
    }
    
    return matchedLocation;
  }, []);

  // Generate mock job data - separated for better maintainability
  const generateMockJobs = useCallback((title: string, locationStr: string): JobCard[] => {
    // Get location-specific details
    const { cities, companies } = getLocationDetails(locationStr || 'usa');
    
    // Create job titles with more variety
    const jobTitles = [
      title,                            // Original title
      `Senior ${title}`,                // Senior level
      `${title} Specialist`,            // Specialist
      `${title.split(' ')[0]} Engineer`,// Different role based on first word
      `Lead ${title}`                   // Lead role
    ];
    
    // Generate unique job IDs for LinkedIn URLs
    const jobIds = ['3234815203', '3244891045', '3256721809', '3261439272', '3271982104'];
    
    return [
      {
        id: '1',
        title: jobTitles[0],
        company: companies[0],
        location: `${cities[0]}, ${locationStr}`,
        type: 'Full-time',
        postedDate: 'Posted 1 day ago',
        description: `We're looking for a talented ${title} to join our growing team.`,
        url: `https://www.linkedin.com/jobs/view/${jobIds[0]}/`,
        logoUrl: `https://placehold.co/80x80/FEF2DE/FF8A3C?text=${companies[0].charAt(0)}&font=montserrat`,
        daysAgo: 1,
        liked: false
      },
      {
        id: '2',
        title: jobTitles[1],
        company: companies[1],
        location: `${cities[1]}, ${locationStr}`,
        type: 'Full-time',
        postedDate: 'Posted 4 days ago',
        description: `Experienced ${title} needed for leading our technical projects.`,
        url: `https://www.linkedin.com/jobs/view/${jobIds[1]}/`,
        logoUrl: `https://placehold.co/80x80/E9F1FF/6366F1?text=${companies[1].charAt(0)}&font=montserrat`,
        daysAgo: 4,
        liked: false
      },
      {
        id: '3',
        title: jobTitles[2],
        company: companies[2],
        location: `${cities[2]}, ${locationStr}`,
        type: 'Contract',
        postedDate: 'Posted 2 days ago',
        description: `Join our team as a ${title} Specialist to work on exciting projects.`,
        url: `https://www.linkedin.com/jobs/view/${jobIds[2]}/`,
        logoUrl: `https://placehold.co/80x80/FEF2DE/FF8A3C?text=${companies[2].charAt(0)}&font=montserrat`,
        daysAgo: 2,
        liked: false
      },
      {
        id: '4',
        title: jobTitles[3],
        company: companies[3],
        location: `${cities[3]}, ${locationStr}`,
        type: 'Full-time',
        postedDate: 'Posted 5 days ago',
        description: `Join our team as a ${title} to work on exciting projects.`,
        url: `https://www.linkedin.com/jobs/view/${jobIds[3]}/`,
        logoUrl: `https://placehold.co/80x80/F4F5F7/FF5722?text=${companies[3].charAt(0)}&font=montserrat`,
        daysAgo: 5,
        liked: false
      },
      {
        id: '5',
        title: jobTitles[4],
        company: companies[4],
        location: `${cities[4]}, ${locationStr}`,
        type: 'Full-time',
        postedDate: 'Posted 3 days ago',
        description: `Join our team as a ${title} to work on exciting projects.`,
        url: `https://www.linkedin.com/jobs/view/${jobIds[4]}/`,
        logoUrl: `https://placehold.co/80x80/E9F1FF/6366F1?text=${companies[4].charAt(0)}&font=montserrat`,
        daysAgo: 3,
        liked: false
      }
    ];
  }, [getLocationDetails]);

  // Function to generate job suggestions - now uses the separate mock data generator
  const generateJobSuggestions = useCallback(() => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const locationString = getLocationString();
      console.log('Generating jobs for location:', locationString);
      const mockJobs = generateMockJobs(jobTitle || '', locationString);
      
      // Simulate possibility of no results (uncommenting this would show "no jobs found" message)
      // const mockJobs: JobCard[] = [];
      
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, [jobTitle, getLocationString, generateMockJobs]);

  // Toggle job like status with useCallback for better performance
  const toggleLike = useCallback((jobId: string) => {
    setJobs(prevJobs => {
      const updatedJobs = prevJobs.map(job => 
        job.id === jobId ? { ...job, liked: !job.liked } : job
      );
      
      // Optional: could save liked status to localStorage here
      // localStorage.setItem('likedJobs', JSON.stringify(updatedJobs.filter(job => job.liked).map(job => job.id)));
      
      return updatedJobs;
    });
  }, []);

  const NoJobsPlaceholder = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center border border-gray-100">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="font-medium text-gray-900">No Job Suggestions Yet</h3>
      <p className="text-gray-500 text-sm text-center mt-2">
        Fill in your job title and location in your personal details to get job suggestions.
      </p>
    </div>
  );

  const LocationPrompt = () => (
    <div className="bg-blue-50 rounded-lg p-6 flex items-start gap-4 mb-6">
      <div className="flex-shrink-0">
        <svg className="w-12 h-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div>
        <h3 className="font-bold text-blue-800 text-lg mb-1">Where will you work?</h3>
        <p className="text-blue-700 mb-2">Tell us where you want to be and we'll find jobs to match.</p>
        <button 
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => {}}
        >
          Set your location
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );

  // Empty state component for when no jobs are found
  const NoJobsFound = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
      <p className="text-gray-500 text-center mt-1">Try a different job title or location</p>
    </div>
  );

  if (!hasRequiredData) {
    return (
      <div>
        <LocationPrompt />
        <NoJobsPlaceholder />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Job Suggestions</h2>
        <a 
          href={buildLinkedInUrl(jobTitle || '', getLocationString())}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          View All Jobs
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {loading ? (
        // Skeleton loader instead of spinner for better perceived performance
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white rounded-lg overflow-hidden border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded bg-gray-200 animate-pulse"></div>
                  <div>
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        // Show empty state when no jobs are found
        <NoJobsFound />
      ) : (
        // Show job cards when we have data
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <a 
                href={job.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={job.logoUrl} 
                        alt={`${job.company} logo`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/80x80/E9F1FF/6366F1?text=Job&font=montserrat';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent link
                      e.preventDefault();   // Prevent navigation
                      toggleLike(job.id);
                    }} 
                    className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 rounded-full p-1 transition-colors duration-200"
                    aria-label={job.liked ? "Remove from favorites" : "Add to favorites"}
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleLike(job.id);
                      }
                    }}
                  >
                    {job.liked ? (
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-gray-500 text-sm">{job.postedDate}</p>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSuggestions;