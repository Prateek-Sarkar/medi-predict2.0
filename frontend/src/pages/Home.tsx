
import { NavLink } from 'react-router-dom';
import { ArrowRight, Upload, Cpu, FileCheck, Eye, Zap, ShieldCheck } from 'lucide-react';
import './Home.css';

export function Home() {
    return (
        <div className="home page-enter">
            {/* ─── HERO ─── */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-content">
                        <div className="hero-label"><span className="dot" />Advanced Medical AI</div>
                        <h1 className="hero-title">
                            Early detection<br />for better <em>vision</em>
                        </h1>
                        <p className="hero-subtitle">
                            MediPredict uses state-of-the-art AI to analyze retinal fundus and facial images, detecting 16 distinct eye diseases with clinical-grade precision.
                        </p>
                        <div className="hero-actions">
                            <NavLink to="/detect" className="btn btn-primary btn-lg">
                                Start AI Detection <ArrowRight size={18} />
                            </NavLink>
                            <NavLink to="/diseases" className="btn btn-outline btn-lg">
                                Learn About Diseases
                            </NavLink>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="visual-card">
                            <div className="visual-card-header">
                                <div className="visual-pulse" />
                                <span>AI Scan Result</span>
                                <span className="visual-live">Live</span>
                            </div>
                            <div className="visual-scan-area">
                                <div className="visual-eye-icon">👁️</div>
                                <div className="visual-scan-line" />
                            </div>
                            <div className="visual-result">
                                <div className="visual-result-row">
                                    <span className="visual-condition">Glaucoma</span>
                                    <span className="severity-badge severity-high"><span className="dot" />High</span>
                                </div>
                                <div className="visual-confidence-row">
                                    <span className="visual-conf-label">Confidence</span>
                                    <span className="visual-conf-val">94.2%</span>
                                </div>
                                <div className="visual-bar-bg">
                                    <div className="visual-bar-fill" style={{ width: '94.2%' }} />
                                </div>
                                <p className="visual-note">Elevated intraocular pressure detected. Recommend specialist consultation.</p>
                            </div>
                            <div className="visual-card-stats">
                                <div className="v-stat"><span className="v-stat-val">16</span><span className="v-stat-lbl">Conditions</span></div>
                                <div className="v-stat-divider" />
                                <div className="v-stat"><span className="v-stat-val">94.2%</span><span className="v-stat-lbl">Accuracy</span></div>
                                <div className="v-stat-divider" />
                                <div className="v-stat"><span className="v-stat-val">&lt;2s</span><span className="v-stat-lbl">Speed</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section className="how-section">
                <div className="how-inner">
                    <div className="section-header text-center">
                        <h2 className="section-title">How it works</h2>
                        <p className="section-subtitle centered">Three simple steps from scan to insight</p>
                    </div>
                    <div className="steps-row">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-icon-wrap"><Upload size={24} /></div>
                            <h3>Upload</h3>
                            <p>Upload a retinal fundus or facial image in PNG/JPG format.</p>
                        </div>
                        <div className="step-connector">
                            <ArrowRight size={20} />
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-icon-wrap"><Cpu size={24} /></div>
                            <h3>AI Analyzes</h3>
                            <p>Our deep learning model processes your image in under 2 seconds.</p>
                        </div>
                        <div className="step-connector">
                            <ArrowRight size={20} />
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-icon-wrap"><FileCheck size={24} /></div>
                            <h3>Get Results</h3>
                            <p>Receive a detailed report with condition, confidence, and severity.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section className="features-section">
                <div className="features-inner">
                    <div className="section-header">
                        <h2 className="section-title">Why choose MediPredict?</h2>
                        <p className="section-subtitle">Built for precision, speed, and trust in clinical screening.</p>
                    </div>
                    <div className="features-list">
                        <div className="feature-item">
                            <div className="feature-num">
                                <Eye size={22} />
                            </div>
                            <div className="feature-body">
                                <h3>Comprehensive Analysis</h3>
                                <p>Detects cataracts, glaucoma, diabetic retinopathy, macular degeneration, and 12 more conditions from a single standard fundus image.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-num">
                                <Zap size={22} />
                            </div>
                            <div className="feature-body">
                                <h3>Instant Results</h3>
                                <p>Receive diagnostic insights within seconds, accompanied by confidence scores, severity classification, and downloadable PDF reports.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-num">
                                <ShieldCheck size={22} />
                            </div>
                            <div className="feature-body">
                                <h3>Secure &amp; Private</h3>
                                <p>Medical privacy is paramount. Your images are processed in real-time and never stored permanently without your explicit consent.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
