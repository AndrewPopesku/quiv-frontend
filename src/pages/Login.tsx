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
                            <div className="relative w-full h-12">
                                <Button type="button" variant="outline" className="w-full gap-2 pointer-events-none bg-black hover:bg-black" size="lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Sign in with Google
                                </Button>
                                <div className="absolute inset-0 opacity-0 overflow-hidden">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError("Google sign-in failed.")}
                                        size="large"
                                        width="400"
                                    />
                                </div>
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
                            <div className="relative w-full h-12">
                                <Button type="button" variant="outline" className="w-full gap-2 pointer-events-none bg-black hover:bg-black" size="lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Sign in with Google
                                </Button>
                                <div className="absolute inset-0 opacity-0 overflow-hidden">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError("Google sign-in failed.")}
                                        size="large"
                                        width="400"
                                    />
                                </div>
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
