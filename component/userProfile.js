function userProfile(user) {
    if (!user) return '';
    
    const firstName = user.firstName || 'User';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const userType = user.userType || 'student';
    const initials = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
    const email = user.email || '';
    const mobile = user.mobile || '';
    const city = user.city || '';
    const companyName = user.companyName || '';
    const qualification = user.qualification || '';
    
    // Get user type display name
    const userTypeDisplay = userType === 'student' ? 'Student' : 'Company';
    const userTypeIcon = userType === 'student' 
        ? '<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>'
        : '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>';
    
    // Get status badge color
    const statusColor = userType === 'student' ? '#0066CC' : '#FF6600';
    
    return `
        <div id="user_profile_container" style="position: relative;">
            <div id="user_profile_btn" style="display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 8px 12px 8px 8px; border-radius: 30px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 2px solid transparent; background: linear-gradient(135deg, rgba(0,102,204,0.05) 0%, rgba(255,102,0,0.05) 100%);">
                <div id="user_avatar" style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #0066CC 0%, #FF6600 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(0,102,204,0.25); position: relative; overflow: hidden; border: 2px solid white;">
                    <div style="position: absolute; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%);"></div>
                    <span style="position: relative; z-index: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${initials}</span>
                    <div style="position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; background: #10b981; border-radius: 50%; border: 2px solid white; z-index: 2;"></div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; min-width: 0;">
                    <span id="user_name" style="font-weight: 600; color: #1f2937; font-size: 14px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">${fullName}</span>
                    <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                        <span style="font-size: 11px; color: #6b7280; text-transform: capitalize; font-weight: 500;">${userTypeDisplay}</span>
                        <span style="width: 4px; height: 4px; background: ${statusColor}; border-radius: 50%; display: inline-block;"></span>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" id="user_dropdown_icon" style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0;">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
            </div>
            <div id="user_profile_dropdown" style="display: none; position: absolute; top: calc(100% + 15px); right: 0; background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05); min-width: 320px; max-width: 360px; z-index: 1000; overflow: hidden; opacity: 0; transform: translateY(-10px) scale(0.95); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                <div style="background: linear-gradient(135deg, #0066CC 0%, #FF6600 100%); padding: 24px 20px; color: white; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
                    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px; position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 20px; border: 3px solid rgba(255,255,255,0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                            ${initials}
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-weight: 700; font-size: 17px; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fullName}</div>
                            <div style="font-size: 12px; opacity: 0.95; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display: inline-block; flex-shrink: 0;">
                                    ${userTypeIcon}
                                </svg>
                                <span style="font-weight: 500;">${userTypeDisplay}</span>
                            </div>
                            ${userType === 'student' && city ? `<div style="font-size: 11px; opacity: 0.9; display: flex; align-items: center; gap: 5px; margin-top: 2px;"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display: inline-block; flex-shrink: 0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><span>${city}</span></div>` : ''}
                            ${userType === 'company' && companyName ? `<div style="font-size: 11px; opacity: 0.9; display: flex; align-items: center; gap: 5px; margin-top: 2px;"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display: inline-block; flex-shrink: 0;"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect></svg><span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${companyName}</span></div>` : ''}
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px; position: relative; z-index: 1;">
                        ${email ? `<div style="font-size: 12px; opacity: 0.95; display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(255,255,255,0.15); border-radius: 8px; backdrop-filter: blur(5px);"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display: inline-block; flex-shrink: 0;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg><span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">${email}</span></div>` : ''}
                        ${mobile ? `<div style="font-size: 12px; opacity: 0.95; display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(255,255,255,0.15); border-radius: 8px; backdrop-filter: blur(5px);"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display: inline-block; flex-shrink: 0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg><span>${mobile}</span></div>` : ''}
                    </div>
                </div>
                <div id="user_profile_menu" style="padding: 12px;">
                    <a href="dashboard.html" class="profile_menu_item" style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; color: #1f2937; text-decoration: none; border-radius: 10px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 6px; background: #f9fafb;">
                        <div style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #0066CC 0%, #FF6600 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,102,204,0.2);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px; color: #1f2937; margin-bottom: 2px;">Dashboard</div>
                            <div style="font-size: 11px; color: #6b7280;">View your overview</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </a>
                    <a href="profile.html" class="profile_menu_item" style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; color: #1f2937; text-decoration: none; border-radius: 10px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 6px; background: #f9fafb;">
                        <div style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, rgba(0,102,204,0.1) 0%, rgba(255,102,0,0.1) 100%); display: flex; align-items: center; justify-content: center; border: 2px solid rgba(0,102,204,0.2);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px; color: #1f2937; margin-bottom: 2px;">My Profile</div>
                            <div style="font-size: 11px; color: #6b7280;">View and edit your profile</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </a>
                    ${userType === 'student' ? `<a href="internship.html" class="profile_menu_item" style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; color: #1f2937; text-decoration: none; border-radius: 10px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 6px; background: #f9fafb;">
                        <div style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, rgba(0,102,204,0.1) 0%, rgba(255,102,0,0.1) 100%); display: flex; align-items: center; justify-content: center; border: 2px solid rgba(0,102,204,0.2);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px; color: #1f2937; margin-bottom: 2px;">My Internships</div>
                            <div style="font-size: 11px; color: #6b7280;">View your applications</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </a>` : ''}
                    <div style="height: 1px; background: #e5e7eb; margin: 8px 0;"></div>
                    <a href="#" id="logout_btn" class="profile_menu_item" style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; color: #dc2626; text-decoration: none; border-radius: 10px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); background: #fef2f2;">
                        <div style="width: 40px; height: 40px; border-radius: 10px; background: #fee2e2; display: flex; align-items: center; justify-content: center; border: 2px solid #fecaca;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px; color: #dc2626; margin-bottom: 2px;">Logout</div>
                            <div style="font-size: 11px; color: #991b1b;">Sign out of your account</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    `;
}

export default userProfile;

