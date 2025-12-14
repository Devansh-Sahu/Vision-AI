import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const next = searchParams.get("next") || "/dashboard"

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const redirectedUrl = new URL(next, request.url)
            return NextResponse.redirect(redirectedUrl)
        }
    }

    // Return the user to an error page with instructions
    const errorUrl = new URL("/login", request.url)
    errorUrl.searchParams.set("error", "auth_code_error")
    return NextResponse.redirect(errorUrl)
}
