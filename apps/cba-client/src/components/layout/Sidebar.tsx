'use client';

/**
 * CBA Sidebar Component
 * 
 * Reusable right-column sidebar matching CommBank "New to NetBank?" design
 * Used across all form-based pages for visual consistency
 */

// Shield Icon SVG component
function ShieldIcon() {
    return (
        <svg className="shield-icon" width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10 0L0 4V11C0 17.05 4.27 22.74 10 24C15.73 22.74 20 17.05 20 11V4L10 0ZM8 17L4 13L5.41 11.59L8 14.17L14.59 7.58L16 9L8 17Z"
                fill="#7A7A7A"
            />
        </svg>
    );
}

interface SidebarProps {
    title: string;
    showProtectionNotice?: boolean;
    children?: React.ReactNode;
}

export function Sidebar({ title, showProtectionNotice = true, children }: SidebarProps) {
    return (
        <div className="new-box">
            <div className="box-header">
                <span>{title}</span>
            </div>
            <div className="box-content new-content">
                {children ? (
                    children
                ) : (
                    <ul className="new-links">
                        <li><a href="#">Tips to stay safe online</a></li>
                        <li><a href="#">Online support for our products and services</a></li>
                        <li><a href="#">Contact us</a></li>
                    </ul>
                )}

                {showProtectionNotice && (
                    <div className="protection-notice">
                        <ShieldIcon />
                        <a href="#" className="protection-link">Protection for unauthorised transactions</a>
                    </div>
                )}
            </div>
        </div>
    );
}

// For KYC and verification pages
export function VerificationSidebar() {
    return (
        <Sidebar title="Need help?">
            <ul className="new-links">
                <li><a href="#">How identity verification works</a></li>
                <li><a href="#">Accepted forms of ID</a></li>
                <li><a href="#">Contact us</a></li>
            </ul>
        </Sidebar>
    );
}

// For status pages (completed/terminated)
export function StatusSidebar({ isSuccess = true }: { isSuccess?: boolean }) {
    return (
        <Sidebar title={isSuccess ? "What's next?" : "Need help?"}>
            <ul className="new-links">
                {isSuccess ? (
                    <>
                        <li><a href="#">Manage your accounts in NetBank</a></li>
                        <li><a href="#">Set up additional security features</a></li>
                        <li><a href="#">View your recent transactions</a></li>
                    </>
                ) : (
                    <>
                        <li><a href="#">Report a security concern</a></li>
                        <li><a href="#">Frequently asked questions</a></li>
                        <li><a href="#">Contact our support team</a></li>
                    </>
                )}
            </ul>
        </Sidebar>
    );
}
