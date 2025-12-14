import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any, // type cast to avoid future version errors
})

export async function POST(req: Request) {
    try {
        const { priceId } = await req.json()

        // Map frontend IDs to Ad-Hoc Price Data for Test Mode
        const PRICE_MAP: Record<string, any> = {
            "price_1SdZM5FukbsOAJbKPtMJgZtH": { unit_amount: 500, product_data: { name: "Vision-AI Pro (Monthly)" }, recurring: { interval: "month" } },
            "price_1SdZM5FukbsOAJbKNmlxe4A3": { unit_amount: 5000, product_data: { name: "Vision-AI Pro (Yearly)" }, recurring: { interval: "year" } },
            "price_1SdZMTFukbsOAJbKxCe0z2KE": { unit_amount: 2000, product_data: { name: "Vision-AI Enterprise (Monthly)" }, recurring: { interval: "month" } },
            "price_1SdZMnFukbsOAJbKig3R1of5": { unit_amount: 20000, product_data: { name: "Vision-AI Enterprise (Yearly)" }, recurring: { interval: "year" } }
        };

        const adHoc = PRICE_MAP[priceId];
        const line_item = adHoc
            ? { price_data: { currency: 'usd', ...adHoc }, quantity: 1 }
            : { price: priceId, quantity: 1 };

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [line_item],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error("Stripe error:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
