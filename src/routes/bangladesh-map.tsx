import { createFileRoute } from "@tanstack/react-router";
import { MapPinned, Navigation, Trees, Waves } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/bangladesh-map")({
  head: () => ({ meta: [{ title: "বাংলাদেশ মানচিত্র · E-পাঠশালা" }] }),
  component: BangladeshMap,
});

function BangladeshMap() {
  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="text-sm text-muted-foreground">ভূগোলের কোণ</p>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <MapPinned className="w-8 h-8 text-primary" /> বাংলাদেশ মানচিত্র
          </h1>
          <p className="text-muted-foreground">Google Maps-এ বাংলাদেশ দেখো, তারপর মানচিত্রের জ্ঞানকে সমাজবিজ্ঞান পাঠের সঙ্গে মিলিয়ে নাও।</p>
        </header>

        <section className="grid lg:grid-cols-[1.25fr_0.75fr] gap-5">
          <div className="glass-strong rounded-[2rem] overflow-hidden shadow-soft">
            <div className="bg-gradient-hero text-white p-5 md:p-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm/6 opacity-85">Google Maps ভিউ</p>
                <h2 className="text-2xl font-bold">Google Maps-এ বাংলাদেশ</h2>
              </div>
              <a
                href="https://www.google.com/maps/place/Bangladesh"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-primary font-semibold shadow-soft"
              >
                <Navigation className="w-4 h-4" /> মানচিত্রে খুলো
              </a>
            </div>
            <iframe
              title="Bangladesh Google map"
              src="https://www.google.com/maps?q=Bangladesh&z=6&output=embed"
              className="w-full h-[640px] border-0 bg-background"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="space-y-4">
            <div className="glass rounded-3xl p-5">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <Waves className="w-5 h-5 text-brand-blue" /> মানচিত্রের আইডিয়া
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• ঢাকা, চট্টগ্রাম, আর সিলেট খুঁজে দেখো।</li>
                <li>• পদ্মা, যমুনা, আর মেঘনা নদী ট্রেস করো।</li>
                <li>• সুন্দরবন আর বঙ্গোপসাগরের উপকূল দেখো।</li>
              </ul>
            </div>

            <div className="glass rounded-3xl p-5">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <Trees className="w-5 h-5 text-brand-green" /> কেন দরকার
              </h3>
              <p className="text-sm text-muted-foreground leading-6">
                বইয়ে শুধু নাম পড়ার চেয়ে, বাস্তব জায়গা zoom করে দেখলে ভূগোল অনেক সহজ হয়ে যায়।
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
