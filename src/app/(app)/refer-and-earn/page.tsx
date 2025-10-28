
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Gift, Copy, Share2, Wallet, Users, Banknote, Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const referralCode = "AROGYA-LOKESH-24";
const walletBalance = 150;

export default function ReferAndEarnPage() {
    const { toast } = useToast();
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: "Join me on Arogyadhatha!",
            text: `I'm using Arogyadhatha for all my health needs. Sign up with my code ${referralCode} and we both get ₹20 cashback!`,
            url: window.location.origin,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                throw new Error("Web Share API not supported");
            }
        } catch (error) {
            console.warn("Share failed, falling back to clipboard:", error);
            navigator.clipboard.writeText(shareData.text);
            toast({
                title: "Copied to Clipboard!",
                description: "Your referral message has been copied.",
            });
        }
    };
    
    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        setIsWithdrawing(true);
        setTimeout(() => {
            setIsWithdrawing(false);
            toast({
                title: "Withdrawal Request Submitted",
                description: `Your request to withdraw ₹${walletBalance} is being processed. It will be credited to your account within 2-3 business days.`,
            });
            // Here you would typically close the dialog
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="inline-block p-3 bg-primary/10 rounded-full">
                     <Gift className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">Refer & Earn</h1>
                <p className="text-muted-foreground">Share the benefits of Arogyadhatha and earn rewards!</p>
            </div>

            <Card className="border text-center">
                <CardHeader>
                    <CardTitle>Your Referral Code</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold tracking-widest flex-1">{referralCode}</p>
                        <Button onClick={handleShare} size="icon" variant="ghost">
                            <Copy className="h-6 w-6" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

             <Card className="border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-left">
                    <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">1</div>
                        <div>
                            <h3 className="font-semibold">Share Your Code</h3>
                            <p className="text-sm text-muted-foreground">Use the share button to send your unique referral code to friends and family.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">2</div>
                        <div>
                            <h3 className="font-semibold">They Sign Up</h3>
                            <p className="text-sm text-muted-foreground">Your friend downloads the app and signs up using your referral code.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">3</div>
                        <div>
                            <h3 className="font-semibold">You Both Earn!</h3 >
                            <p className="text-sm text-muted-foreground">You both receive <span className="font-bold text-primary">₹20 cashback</span> in your Arogyadhatha wallets instantly!</p>
                        </div>
                    </div>
                </CardContent>
                <CardContent>
                     <Button className="w-full" variant="secondary" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share Your Code
                    </Button>
                </CardContent>
            </Card>

            <Card className="border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5"/>My Wallet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="text-center p-6 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Current Balance</p>
                        <p className="text-5xl font-extrabold text-primary">₹{walletBalance}</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                             <Button disabled={walletBalance === 0} className="w-full h-12 text-base">
                                <Banknote className="mr-2 h-5 w-5" />Withdraw to Bank Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Withdraw Funds</DialogTitle>
                                <DialogDescription>
                                    Enter your bank details to withdraw ₹{walletBalance}. The amount will be credited within 2-3 business days.
                                </DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4" onSubmit={handleWithdraw}>
                                <div className="space-y-2">
                                    <Label htmlFor="account-name">Account Holder Name</Label>
                                    <Input id="account-name" placeholder="Enter name as per bank records" required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account-number">Bank Account Number</Label>
                                    <Input id="account-number" placeholder="Enter your account number" required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ifsc-code">IFSC Code</Label>
                                    <Input id="ifsc-code" placeholder="Enter your bank's IFSC code" required/>
                                </div>
                                <Button type="submit" disabled={isWithdrawing} className="w-full">
                                    {isWithdrawing ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                                    ) : `Submit Request`}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}
