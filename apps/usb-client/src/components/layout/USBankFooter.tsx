export function USBankFooter() {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                {/* Connection Secured Row */}
                <div className="footer-secured-row">
                    <div className="secure-indicator">
                        <span className="lock-icon">
                            {/* Lock icon is a background image in CSS usually, but here it's a span or img in reference. 
                    Reference: <span class="lock-icon"></span> 
                    Styles: likely has background-image or ::before 
                */}
                        </span>
                        <span>Connection Secured</span>
                    </div>
                    <div className="footer-links">
                        <a href="#">Security</a>
                        <span className="separator">|</span>
                        <a href="#">Privacy</a>
                        <span className="separator">|</span>
                        <a href="#">
                            Your California privacy choices <img src="/brands/us-bank/PrivacyOptionsCal.png" alt="" className="cali-icon" style={{ display: 'inline', verticalAlign: 'middle', height: '14px', marginLeft: '4px' }} />
                        </a>
                        <span className="separator">|</span>
                        <a href="#">CoBrowse</a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-meta">
                    <div>©2026 U.S. Bank</div>
                    <div className="version">OLB Cloud : 2.56.0_BN_7795</div>
                </div>

                <hr className="footer-divider" />

                {/* Disclosures */}
                <div className="disclosures-container">
                    <p className="disclosure-header">Investment and Insurance products and services including annuities are:</p>
                    <ul className="disclosure-list">
                        <li>Not a Deposit</li>
                        <li>Not FDIC Insured</li>
                        <li>May Lose Value</li>
                        <li>Not Bank Guaranteed</li>
                        <li>Not Insured by any Federal Government Agency</li>
                    </ul>
                </div>

                {/* Legal Sections */}
                <div className="legal-sections">
                    <div className="legal-section">
                        <h3>For U.S. Bank:</h3>
                        <p className="content">
                            <img src="/brands/us-bank/EqualHousingLender.png" alt="Equal Housing Lender" className="ehl-icon" style={{ float: 'left', marginRight: '5px', height: '15px' }} />
                            Equal Housing Lender. Deposit products offered by U.S. Bank National Association. Member FDIC
                        </p>
                        <p className="content">U.S. Bank is not responsible for and does not guarantee the products, services or
                            performance of U.S. Bancorp Investments and U.S. Bancorp Advisors.</p>
                    </div>

                    <div className="legal-section">
                        <h3>For U.S. Bancorp Investments:</h3>
                        <p className="content">Investment products and services are available through U.S. Bancorp Investments, the
                            marketing name for U.S. Bancorp Investments, Inc., member <a href="#">FINRA</a> and <a href="#">SIPC</a>,
                            an investment adviser and a brokerage subsidiary of U.S. Bancorp and affiliate of U.S. Bank.</p>
                        <p className="content">U.S. Bancorp Investments is registered with the Securities and Exchange Commission as
                            both a broker-dealer and an investment adviser. To understand how brokerage and investment advisory
                            services and fees differ, the <a href="#">Client Relationship Summary</a> and <a href="#">Regulation Best
                                Interest Disclosure</a> are available for you to review.</p>
                        <p className="content">The Financial Industry Regulatory Authority (FINRA) Rule 2267 provides for BrokerCheck to
                            allow investors to learn about the professional background, business practices, and conduct of FINRA
                            member firms or their brokers. To request such information, contact FINRA toll-free 1.800.289.9999 or via
                            <a href="#">BrokerCheck</a> website. An investor brochure describing BrokerCheck is also available through
                            FINRA.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3>For U.S. Bancorp Advisors:</h3>
                        <p className="content">Brokerage and investment advisory services offered by U.S. Bancorp Advisors LLC, member
                            <a href="#">FINRA</a> and <a href="#">SIPC</a>, an investment adviser and a brokerage subsidiary of U.S.
                            Bancorp and affiliate of U.S. Bank.
                        </p>
                        <p className="content">U.S. Bancorp Advisors is registered with the Securities and Exchange Commission as both a
                            broker-dealer and an investment adviser. To understand how brokerage and investment advisory services and
                            fees differ, the <a href="#">Client Relationship Summary</a> and <a href="#">Regulation Best Interest
                                Disclosure</a> are available for you to review.</p>
                        <p className="content">The Financial Industry Regulatory Authority (FINRA) Rule 2267 provides for BrokerCheck to
                            allow investors to learn about the professional background, business practices, and conduct of FINRA
                            member firms or their brokers. To request such information, contact FINRA toll-free 1.800.289.9999 or via
                            <a href="#">BrokerCheck</a> website. An investor brochure describing BrokerCheck is also available through
                            FINRA.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
