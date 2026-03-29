import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles, LogIn, UserPlus, Loader2 } from "lucide-react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserService, DictionaryService } from "@/api";
import type { Language } from "@/api/models/Language";

type View = "login" | "register" | "google-profile";

const inputClass =
    "w-full bg-muted border border-border rounded-xl py-2.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm";

const selectClass =
    "w-full bg-muted border border-border rounded-xl py-2.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm appearance-none";

export default function Login() {
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const [view, setView] = useState<View>(searchParams.get("register") ? "register" : "login");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [languages, setLanguages] = useState<Language[]>([]);

    // Login fields
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register fields
    const [regEmail, setRegEmail] = useState("");
    const [regUsername, setRegUsername] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPassword, setRegConfirmPassword] = useState("");
    const [regUserLanguage, setRegUserLanguage] = useState("");
    const [regTargetLanguage, setRegTargetLanguage] = useState("");

    // Google auth fields
    const [googleIdToken, setGoogleIdToken] = useState("");
    const [googleUserLanguage, setGoogleUserLanguage] = useState("");
    const [googleTargetLanguage, setGoogleTargetLanguage] = useState("");

    useEffect(() => {
        DictionaryService.dictionaryLanguagesList().then(setLanguages).catch(() => {});
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const response = await UserService.userTokenCreate({
                email: loginEmail,
                password: loginPassword,
            } as any);
            login(response.access, response.refresh);
        } catch {
            setError("Invalid email or password.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (regPassword !== regConfirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!regUserLanguage || !regTargetLanguage) {
            setError("Please select both languages.");
            return;
        }
        if (regUserLanguage === regTargetLanguage) {
            setError("Native and target languages must be different.");
            return;
        }
        setIsLoading(true);
        try {
            await UserService.userRegisterCreate({
                email: regEmail,
                username: regUsername,
                password: regPassword,
                profile: {
                    user_language: Number(regUserLanguage),
                    target_language: Number(regTargetLanguage),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            } as any);
            // Auto-login after registration
            const tokens = await UserService.userTokenCreate({
                email: regEmail,
                password: regPassword,
            } as any);
            login(tokens.access, tokens.refresh);
        } catch {
            setError("Registration failed. Email may already be in use.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (response: CredentialResponse) => {
        if (!response.credential) return;
        setError("");
        setIsLoading(true);
        try {
            const result = await UserService.userGoogleCreate({
                id_token: response.credential,
            });
            login(result.access, result.refresh);
        } catch (err: any) {
            const detail = err?.body?.detail;
            if (detail && detail.includes("Profile data")) {
                // New user — need language selection
                setGoogleIdToken(response.credential);
                setView("google-profile");
            } else {
                setError("Google sign-in failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!googleUserLanguage || !googleTargetLanguage) {
            setError("Please select both languages.");
            return;
        }
        if (googleUserLanguage === googleTargetLanguage) {
            setError("Native and target languages must be different.");
            return;
        }
        setIsLoading(true);
        try {
            const result = await UserService.userGoogleCreate({
                id_token: googleIdToken,
                profile: {
                    user_language: Number(googleUserLanguage),
                    target_language: Number(googleTargetLanguage),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            });
            login(result.access, result.refresh);
        } catch {
            setError("Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const switchView = (newView: View) => {
        setView(newView);
        setError("");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header with logo */}
            <div className="flex items-center h-16 px-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(30_95%_45%)] flex items-center justify-center shadow-glow">
                        <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-gradient-gold">Levise</span>
                </div>
            </div>

            {/* Center content */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="text-center space-y-6 w-full max-w-sm">
                    {view === "login" && (
                        <form onSubmit={handleLogin} className="space-y-4 text-left">
                            <h1 className="text-2xl font-bold text-foreground text-center">Sign In</h1>
                            {error && <p className="text-sm text-destructive text-center">{error}</p>}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email</label>
                                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className={inputClass} placeholder="Enter your password" />
                            </div>
                            <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                                Sign In
                            </Button>
                            <div className="relative my-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">or</span>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError("Google sign-in failed.")}
                                    theme="filled_black"
                                    size="large"
                                    width="100%"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                Don't have an account?{" "}
                                <button type="button" onClick={() => switchView("register")} className="text-primary hover:underline font-medium">
                                    Create one
                                </button>
                            </p>
                        </form>
                    )}

                    {view === "register" && (
                        <form onSubmit={handleRegister} className="space-y-4 text-left">
                            <h1 className="text-2xl font-bold text-foreground text-center">Create Account</h1>
                            {error && <p className="text-sm text-destructive text-center">{error}</p>}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Username</label>
                                <input type="text" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required className={inputClass} placeholder="Your username" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email</label>
                                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength={8} className={inputClass} placeholder="Min. 8 characters" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                                <input type="password" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} required minLength={8} className={inputClass} placeholder="Repeat password" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">I speak</label>
                                <select value={regUserLanguage} onChange={(e) => setRegUserLanguage(e.target.value)} required className={selectClass}>
                                    <option value="">Select language</option>
                                    {languages.map((l) => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">I want to learn</label>
                                <select value={regTargetLanguage} onChange={(e) => setRegTargetLanguage(e.target.value)} required className={selectClass}>
                                    <option value="">Select language</option>
                                    {languages.map((l) => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                                Create Account
                            </Button>
                            <div className="relative my-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">or</span>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError("Google sign-in failed.")}
                                    theme="filled_black"
                                    size="large"
                                    width="100%"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                Already have an account?{" "}
                                <button type="button" onClick={() => switchView("login")} className="text-primary hover:underline font-medium">
                                    Sign in
                                </button>
                            </p>
                        </form>
                    )}

                    {view === "google-profile" && (
                        <form onSubmit={handleGoogleProfileSubmit} className="space-y-4 text-left">
                            <h1 className="text-2xl font-bold text-foreground text-center">Complete Your Profile</h1>
                            <p className="text-sm text-muted-foreground text-center">Select your languages to get started</p>
                            {error && <p className="text-sm text-destructive text-center">{error}</p>}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">I speak</label>
                                <select value={googleUserLanguage} onChange={(e) => setGoogleUserLanguage(e.target.value)} required className={selectClass}>
                                    <option value="">Select language</option>
                                    {languages.map((l) => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">I want to learn</label>
                                <select value={googleTargetLanguage} onChange={(e) => setGoogleTargetLanguage(e.target.value)} required className={selectClass}>
                                    <option value="">Select language</option>
                                    {languages.map((l) => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                Get Started
                            </Button>
                            <p className="text-sm text-muted-foreground text-center">
                                <button type="button" onClick={() => switchView("login")} className="text-primary hover:underline font-medium">
                                    Back to sign in
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
