import React, { useState, useRef, useEffect } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import ImageCropper from '../ui/ImageCropper';

interface PersonalDetailsFormProps {
  onNext: () => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ onNext }) => {
  const { resume, dispatch } = useResume();
  const { personalDetails } = resume;
  
  const [firstName, setFirstName] = useState(personalDetails.firstName);
  const [lastName, setLastName] = useState(personalDetails.lastName);
  const [jobTitle, setJobTitle] = useState(personalDetails.jobTitle);
  const [email, setEmail] = useState(personalDetails.email);
  const [phone, setPhone] = useState(personalDetails.phone);
  const [address, setAddress] = useState(personalDetails.address);
  const [photo, setPhoto] = useState(personalDetails.photo);
  
  // Additional fields
  const [postalCode, setPostalCode] = useState(personalDetails.postalCode || '');
  const [city, setCity] = useState(personalDetails.city || '');
  const [country, setCountry] = useState(personalDetails.country || '');
  const [drivingLicense, setDrivingLicense] = useState(personalDetails.drivingLicense || '');
  const [dateOfBirth, setDateOfBirth] = useState(personalDetails.dateOfBirth || '');
  const [nationality, setNationality] = useState(personalDetails.nationality || '');
  
  // No longer using toggle for additional details
  
  // State for image cropper
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update context when any field changes
  useEffect(() => {
    updateResumeContext();
  }, [
    firstName, lastName, jobTitle, email, phone, address, photo,
    postalCode, city, country, drivingLicense, dateOfBirth, nationality
  ]);

  const updateResumeContext = () => {
    dispatch({
      type: 'UPDATE_PERSONAL_DETAILS',
      payload: {
        firstName,
        lastName,
        jobTitle,
        email,
        phone,
        address,
        photo,
        postalCode,
        city,
        country,
        drivingLicense,
        dateOfBirth,
        nationality
      }
    });
    
    // Show save indicator
    const saveIndicator = document.getElementById('save-indicator');
    if (saveIndicator) {
      saveIndicator.classList.remove('opacity-0');
      saveIndicator.classList.add('opacity-100');
      
      setTimeout(() => {
        saveIndicator.classList.remove('opacity-100');
        saveIndicator.classList.add('opacity-0');
      }, 2000);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The actual navigation happens in the parent
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'jobTitle':
        setJobTitle(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'postalCode':
        setPostalCode(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'country':
        setCountry(value);
        break;
      case 'drivingLicense':
        setDrivingLicense(value);
        break;
      case 'dateOfBirth':
        setDateOfBirth(value);
        break;
      case 'nationality':
        setNationality(value);
        break;
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Instead of setting photo directly, set the tempImageSrc and show cropper
        setTempImageSrc(result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Removed toggle functionality for additional details
  
  const handleRemovePhoto = () => {
    setPhoto('');
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setPhoto(croppedImageUrl);
    setShowCropper(false);
    setTempImageSrc('');
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageSrc('');
  };

  return (
    <div className="personal-details-form max-w-3xl">
      {showCropper && tempImageSrc && (
        <ImageCropper 
          src={tempImageSrc} 
          onCropComplete={handleCropComplete} 
          onCancel={handleCropCancel} 
        />
      )}
      
      <div className="mb-6">
        <h2 className="text-gray-900 text-xl font-semibold">Personal details</h2>
        <p className="text-gray-500 text-sm mt-1">
        Users who added phone number and email received 64% more positive feedback from recruiters.
      </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Job Title and Photo Upload side by side */}
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-600 mb-1">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="The role you want"
              className="w-full px-3 py-2.5 text-gray-500 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <div className="flex flex-col items-center">
              <div 
                onClick={triggerFileInput}
                className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100 mb-1 relative"
              >
                {photo ? (
                  <>
                    <img 
                      src={photo} 
                      alt="Profile" 
                      className="w-full h-full rounded-md object-cover"
                    />
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop triggering file input click
                        handleRemovePhoto();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                      title="Remove photo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                className="hidden"
                accept="image/*"
              />
              <button 
                type="button" 
                onClick={triggerFileInput}
                className="text-blue-500 font-medium text-xs hover:text-blue-700 transition-colors"
              >
                Upload photo
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="e.g. John"
              className="w-full px-3 py-2.5 text-gray-500 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="e.g. Doe"
              className="w-full px-3 py-2.5 text-gray-500 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="e.g. johndoe@gmail.com"
              className="w-full px-3 py-2.5 text-gray-500 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="e.g. (123) 456-7890"
              className="w-full px-3 py-2.5 text-gray-500 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter your address"
            className="w-full px-3 py-2.5 text-gray-500 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-600 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="e.g. San Francisco"
              className="w-full px-3 py-2.5 text-gray-500 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-600 mb-1">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="e.g. United States"
              className="w-full px-3 py-2.5 text-gray-500 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

      </form>
    </div>
  );
};

export default PersonalDetailsForm;