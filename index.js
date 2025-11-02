#!/usr/bin/env node
import { execa } from 'execa';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Main function to set up a Next.js 16 project with shadcn/ui
 * Creates a fully configured Next.js app with dark mode, shadcn/ui components,
 * and performance optimizations
 * @async
 * @returns {Promise<void>}
 */
async function main() {
  const projectName = process.argv[2];

  // Show help if --help flag is provided
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('Usage: create-0xbasinas <project-name>');
    console.log('\nDescription:');
    console.log('  Creates a Next.js 16 app with shadcn/ui pre-configured');
    console.log('\nExample:');
    console.log('  create-0xbasinas my-app');
    console.log('\nFeatures:');
    console.log('  - Next.js 16 with TypeScript');
    console.log('  - Turbopack for faster development');
    console.log('  - Biome for linting and formatting');
    console.log('  - shadcn/ui with all components');
    console.log('  - Tailwind CSS and App Router');
    console.log('  - Dark mode support with next-themes');
    process.exit(0);
  }

  if (!projectName) {
    console.error('Please provide a project name:');
    console.error('create-0xbasinas <project-name>');
    console.error('\nUse --help for more information');
    process.exit(1);
  }

  // Validate project name
  if (!/^[a-z0-9-]+$/.test(projectName)) {
    console.error('Error: Project name must contain only lowercase letters, numbers, and hyphens');
    process.exit(1);
  }

  try {
    // Run create-next-app with Next.js 16 specific options
    console.log('🚀 Setting up Next.js 16 project...');
    await execWithRetry('npx', [
      'create-next-app@latest',
      projectName,
      '--yes',           // Skip confirmation prompts
      '--typescript',    // Use TypeScript
      '--tailwind',      // Use Tailwind CSS
      '--eslint',        // Include ESLint
      '--biome',         // Use Biome for linting and formatting
      '--app',           // Use App Router
      '--turbopack',     // Enable Turbopack for faster development
      '--import-alias', '@/*' // Set import alias
    ], { stdio: 'inherit' });

    // Change to project directory
    process.chdir(projectName);

    // Initialize shadcn/ui with proper configuration
    console.log('\n🎨 Installing shadcn/ui...');
    await execWithRetry('npx', [
      'shadcn@latest',
      'init',
      '--yes',           // Skip confirmation prompt
      '--css-variables',  // Use CSS variables for theming
      '--base-color', 'neutral'
    ], { stdio: 'inherit' });

    // Install all shadcn/ui components
    console.log('\n📦 Installing shadcn/ui components...');
    await execWithRetry('npx', [
      'shadcn@latest',
      'add',
      '--all',           // Add all available components
      '--yes'            // Skip confirmation prompt
    ], { stdio: 'inherit' });

    // Install next-themes for dark mode support
    console.log('\n🌙 Installing dark mode support...');
    await execWithRetry('npm', ['install', 'next-themes'], { stdio: 'inherit' });

    // Install third-party libraries for performance
    console.log('\n📦 Installing optimized third-party libraries...');
    await execWithRetry('npm', ['install', '@next/third-parties@latest', 'sharp'], { stdio: 'inherit' });

    // Create theme provider component
    console.log('\n🎨 Setting up theme provider...');
    await createThemeProvider();

    // Update root layout to include theme provider
    console.log('\n📝 Updating root layout...');
    await updateRootLayout();

    // Create mode toggle component
    console.log('\n🔧 Creating mode toggle component...');
    await createModeToggle();

    // Create mobile menu component
    console.log('\n📱 Creating mobile menu component...');
    await createMobileMenu();

    // Create header component
    console.log('\n📋 Creating header component...');
    await createHeaderComponent();

    // Create footer component
    console.log('\n📋 Creating footer component...');
    await createFooterComponent();

    // Create hover prefetch link component
    console.log('\n🔗 Creating hover prefetch link component...');
    await createHoverPrefetchLink();

    // Create environment variables with project name
    console.log('\n🔧 Setting up environment variables...');
    await createEnvFile(projectName);

    // Create about and contact pages
    console.log('\n📄 Creating additional pages...');
    await createAboutPage();
    await createContactPage();
    await createPrivacyPage();
    await createTermsPage();
    await createGetStartedPage();

    // Create essential Next.js pages
    console.log('\n📄 Creating essential Next.js pages...');
    await createNotFoundPage();
    await createErrorPage();
    await createLoadingPage();
    await createSitemap();
    await createRobots();

    // Create performance optimizations
    console.log('\n⚡ Setting up performance optimizations...');
    await createOptimizedNextConfig();
    await createInstrumentation();
    await createSuspenseWrapper();
    
    // Create render optimization components
    console.log('\n⚡ Creating render optimization components...');
    await createStreamingLayout();
    await createOptimizedFonts();

    // Update the main page to have a simple hello message
    console.log('\n📄 Updating main page...');
    await updateMainPage();

    // Create proxy middleware file for Next.js 16
    console.log('\n🔧 Setting up proxy middleware...');
    await createProxyMiddleware();

    // Set up Fumadocs for documentation
    console.log('\n📚 Setting up Fumadocs documentation...');
    await setupFumadocs();

    // Reorganize into route groups for isolated layouts
    console.log('\n📁 Organizing route groups for isolated layouts...');
    await organizeRouteGroups();

    console.log('\n✅ Setup complete! To start developing:');
    console.log(`📁 cd ${projectName}`);
    console.log('🚀 npm run dev');
    console.log('\n✨ Your Next.js 16 app with shadcn/ui and dark mode is ready!');

  } catch (error) {
    console.error('\n❌ Error during setup:', error.message);

    // Provide specific error guidance
    if (error.message.includes('ENOENT')) {
      console.error('File or directory not found. Please ensure you have the necessary permissions.');
    } else if (error.message.includes('EACCES') || error.message.includes('EPERM')) {
      console.error('Permission denied. Try running with appropriate permissions or in a different directory.');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('Network error. Please check your internet connection and try again.');
    } else if (error.message.includes('EEXIST')) {
      console.error(`A project with the name "${projectName}" already exists. Please choose a different name.`);
    } else {
      console.error('An unexpected error occurred. Please try again or report the issue.');
    }

    // Show stack trace in debug mode
    if (process.env.DEBUG) {
      console.error('\nStack trace:', error.stack);
    }

    process.exit(1);
  }
}

/**
 * Creates the theme provider component for dark mode support
 * @async
 * @returns {Promise<void>}
 */
async function createThemeProvider() {
  const themeProviderContent = `"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
`;

  await writeFileWithDir('components/theme-provider.tsx', themeProviderContent);
}

/**
 * Updates the root layout to include theme provider, header, and footer
 * @async
 * @returns {Promise<void>}
 */
async function updateRootLayout() {
  const layoutPath = 'app/layout.tsx';
  let layoutContent = await readFile(layoutPath, 'utf-8');
  
  // Import fonts, ThemeProvider, Header, and Footer
  if (!layoutContent.includes('from "@/components/theme-provider"')) {
    layoutContent = layoutContent.replace(
      /import ".\/globals.css";/,
      `import "./globals.css";\nimport { inter } from "@/lib/fonts";\nimport { ThemeProvider } from "@/components/theme-provider";\nimport { Header } from "@/components/header";\nimport { Footer } from "@/components/footer";`
    );
  }

  // Wrap body content with ThemeProvider and add Header and Footer with flex layout
  if (!layoutContent.includes('<ThemeProvider')) {
    layoutContent = layoutContent.replace(
      /<body[^>]*>([\s\S]*?)<\/body>/,
      (match, bodyContent) => {
        return match.replace(
          bodyContent,
          `\n          <ThemeProvider\n            attribute=\"class\"\n            defaultTheme=\"system\"\n            enableSystem\n            disableTransitionOnChange\n          >\n            <div className=\"min-h-screen flex flex-col\">\n              <Header />\n              <main className=\"flex-1 bg-white dark:bg-black\">\n                ${bodyContent.trim()}\n              </main>\n              <Footer />\n            </div>\n          </ThemeProvider>`
        );
      }
    );
  }

  // Add optimized font class and suppressHydrationWarning to html tag
  if (!layoutContent.includes('suppressHydrationWarning')) {
    layoutContent = layoutContent.replace(
      /<html[^>]*>/,
      `<html lang=\"en\" suppressHydrationWarning className={\`\${inter.variable} antialiased\`}>`
    );
  }

  await writeFile(layoutPath, layoutContent);
}

async function createModeToggle() {
  const modeToggleContent = `"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant=\"outline\" size=\"icon\">
          <Sun className=\"h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90\" />
          <Moon className=\"absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0\" />
          <span className=\"sr-only\">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align=\"end\">
        <DropdownMenuItem onClick={() => setTheme(\"light\")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(\"dark\")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(\"system\")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
`;

  await writeFileWithDir('components/mode-toggle.tsx', modeToggleContent);
}

async function createMobileMenu() {
  const mobileMenuContent = `"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export function MobileMenu() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-black border-l border-neutral-200 dark:border-neutral-800 p-6 z-50 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Link
              href="/"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/get-started"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>

            <div className="mt-auto pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <ModeToggle />
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
`;

  await writeFileWithDir('components/mobile-menu.tsx', mobileMenuContent);
}

async function createHeaderComponent() {
  const headerContent = `"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { HoverPrefetchLink } from "@/components/hover-prefetch-link"
import { MobileMenu } from "@/components/mobile-menu"

export function Header() {
  return (
    <header className="bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-black dark:text-white hover:opacity-80 transition-opacity">
          {process.env.NEXT_PUBLIC_APP_NAME || "0xBasinas"}
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <HoverPrefetchLink href="/">
            <span className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              Home
            </span>
          </HoverPrefetchLink>
          <HoverPrefetchLink href="/about">
            <span className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              About
            </span>
          </HoverPrefetchLink>
          <HoverPrefetchLink href="/contact">
            <span className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              Contact
            </span>
          </HoverPrefetchLink>
          <Button asChild variant="outline" className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <HoverPrefetchLink href="/get-started">
              Get Started
            </HoverPrefetchLink>
          </Button>
          <ModeToggle />
        </nav>

        {/* Mobile Navigation */}
        <MobileMenu />
      </div>
    </header>
  )
}
`;

  await writeFileWithDir('components/header.tsx', headerContent);
}

async function createFooterComponent() {
  const footerContent = `"use client"

import * as React from "react"
import { HoverPrefetchLink } from "@/components/hover-prefetch-link"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              {process.env.NEXT_PUBLIC_APP_NAME || "0xBasinas"}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <nav className="flex space-x-6">
            <HoverPrefetchLink href="/about">
              <span className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-sm">
                About
              </span>
            </HoverPrefetchLink>
            <HoverPrefetchLink href="/contact">
              <span className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-sm">
                Contact
              </span>
            </HoverPrefetchLink>
            <HoverPrefetchLink href="/privacy">
              <span className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-sm">
                Privacy
              </span>
            </HoverPrefetchLink>
            <HoverPrefetchLink href="/terms">
              <span className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-sm">
                Terms
              </span>
            </HoverPrefetchLink>
          </nav>
        </div>
      </div>
    </footer>
  )
}
`;

  await writeFileWithDir('components/footer.tsx', footerContent);
}

async function createHoverPrefetchLink() {
  const hoverPrefetchLinkContent = `"use client"

import Link from "next/link"
import { useState } from "react"

export function HoverPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const [prefetch, setPrefetch] = useState(false)

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onMouseEnter={() => setPrefetch(true)}
    >
      {children}
    </Link>
  )
}
`;

  await writeFileWithDir('components/hover-prefetch-link.tsx', hoverPrefetchLinkContent);
}

/**
 * Creates environment file with project-specific configuration
 * @async
 * @param {string} projectName - The name of the project
 * @returns {Promise<void>}
 */
async function createEnvFile(projectName) {
  const envContent = `NEXT_PUBLIC_APP_NAME=${projectName}
NEXT_PUBLIC_APP_DESCRIPTION="A Next.js 16 app with shadcn/ui pre-configured"
NEXT_PUBLIC_APP_AUTHOR="Your Name"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_EMAIL="your.email@example.com"
NEXT_PUBLIC_APP_PHONE="123-456-7890"
NEXT_PUBLIC_APP_ADDRESS="123 Main St, Anytown, USA"
NEXT_PUBLIC_APP_GITHUB="your_github_handle"
NEXT_PUBLIC_APP_LINKEDIN="your_linkedin_handle"
`;

  const envPath = '.env';
  await writeFile(envPath, envContent);
}

async function createAboutPage() {
  const aboutContent = `import Link from "next/link"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold text-left mb-6 text-black dark:text-white">About Us</h1>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <div className="text-left mt-12">
        <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-lg">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
`;

  await writeFileWithDir('app/about/page.tsx', aboutContent);
}

async function createContactPage() {
  const contactContent = `"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function Contact() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold text-left mb-6 text-black dark:text-white">Contact Us</h1>
      <p className="text-lg text-left mb-12 text-neutral-600 dark:text-neutral-400">
        Have questions or feedback? We would love to hear from you.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-lg text-black dark:text-white">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="text-lg bg-white dark:bg-black border-neutral-200 dark:border-neutral-700 text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500"
            required
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="email" className="text-lg text-black dark:text-white">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="text-lg bg-white dark:bg-black border-neutral-200 dark:border-neutral-700 text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500"
            required
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="message" className="text-lg text-black dark:text-white">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={6}
            className="text-lg bg-white dark:bg-black border-neutral-200 dark:border-neutral-700 text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500"
            required
          />
        </div>
        
        <Button type="submit" className="w-full text-lg">
          Send Message
        </Button>
      </form>
      
      <div className="text-left mt-12">
        <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-lg">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
`;

  await writeFileWithDir('app/contact/page.tsx', contactContent);
}

async function createPrivacyPage() {
  const privacyContent = `import Link from "next/link"

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold text-left mb-6 text-black dark:text-white">Privacy Policy</h1>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        We do not collect any personal information from you unless you voluntarily submit it to us.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        We use your email address to send you updates about our products and services, and to respond to your inquiries.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        We do not share your personal information with third parties.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        If you have any questions about this Privacy Policy, please contact us.
      </p>
      <div className="text-left mt-12">
        <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-lg">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
`;

  await writeFileWithDir('app/privacy/page.tsx', privacyContent);
}

async function createTermsPage() {
  const termsContent = `import Link from "next/link"

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold text-left mb-6 text-black dark:text-white">Terms of Service</h1>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        These Terms of Service govern your access to and use of our website, including our products and services.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the website.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        By continuing to access or use our website after any revisions become effective, you agree to be bound by the revised Terms. If you do not agree to the new terms, you are no longer authorized to use the website.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        We may, in our sole discretion, post new terms on the website. Your continued use of the website after such terms are posted will be subject to the new terms.
      </p>
      <p className="text-lg text-left mb-2 text-black dark:text-white">
        If you have any questions about these Terms, please contact us.
      </p>
      <div className="text-left mt-12">
        <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-lg">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
`;

  await writeFileWithDir('app/terms/page.tsx', termsContent);
}

async function createGetStartedPage() {
  const getStartedContent = `import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Zap, Code, Palette } from "lucide-react"

export default function GetStarted() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-black dark:text-white">
          Get Started
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400">
          Everything you need to know to start building with our platform
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Zap className="h-10 w-10 mb-2 text-yellow-500" />
            <CardTitle>Quick Setup</CardTitle>
            <CardDescription>
              Get up and running in minutes with our streamlined setup process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Follow our step-by-step guide to configure your environment and start building.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Code className="h-10 w-10 mb-2 text-blue-500" />
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Comprehensive guides and API references at your fingertips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Explore detailed documentation covering every feature and functionality.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Palette className="h-10 w-10 mb-2 text-purple-500" />
            <CardTitle>Customize</CardTitle>
            <CardDescription>
              Tailor the platform to match your unique requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Personalize themes, components, and workflows to fit your needs.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Quick Start Guide
        </h2>
        <ol className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold">
              1
            </span>
            <div>
              <h3 className="font-semibold text-black dark:text-white">Install Dependencies</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Run npm install to set up all required packages and dependencies.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold">
              2
            </span>
            <div>
              <h3 className="font-semibold text-black dark:text-white">Configure Environment</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Set up your environment variables in the .env file for local development.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold">
              3
            </span>
            <div>
              <h3 className="font-semibold text-black dark:text-white">Start Development Server</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Run npm run dev to start the development server and begin building.
              </p>
            </div>
          </li>
        </ol>
      </div>

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/contact" className="gap-2">
            Need Help? Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="text-center mt-12">
        <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-lg">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
`;

  await writeFileWithDir('app/get-started/page.tsx', getStartedContent);
}

async function updateMainPage() {
  const mainPageContent = `export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold text-left mb-6 text-black dark:text-white">
        Hello
      </h1>
      <p className="text-lg text-left text-neutral-600 dark:text-neutral-400">
        Welcome to your new Next.js app with shadcn/ui.
      </p>
    </div>
  )
}
`;

  const pagePath = 'app/page.tsx';
  await writeFile(pagePath, mainPageContent);
}

async function createProxyMiddleware() {
  const proxyContent = `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy Middleware
 * 
 * This proxy function runs on the Node.js runtime and can be used to:
 * - Redirect requests
 * - Rewrite URLs
 * - Add/remove headers
 * - Handle authentication
 * - Implement A/B testing
 * - Internationalization routing
 * 
 * Note: This replaces the old 'middleware' convention in Next.js 16
 */

export function proxy(request: NextRequest) {
  // Example: Redirect /old-path to /new-path
  if (request.nextUrl.pathname === '/old-path') {
    return NextResponse.redirect(new URL('/new-path', request.url))
  }

  // Example: Add custom header to all requests
  const response = NextResponse.next()
  response.headers.set('x-custom-header', 'hello-world')

  return response
}

/**
 * Configuration for the proxy middleware
 * 
 * The matcher defines which paths this proxy should run on.
 * You can use:
 * - Single paths: '/about'
 * - Multiple paths: ['/about', '/dashboard']
 * - Dynamic paths: '/blog/:slug'
 * - Wildcard paths: '/api/*'
 * - Exclude patterns: '/((?!api|_next/static|_next/image|favicon.ico).*)'
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
`;

  const proxyPath = 'proxy.ts';
  await writeFile(proxyPath, proxyContent);
}

async function createNotFoundPage() {
  const notFoundContent = `import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <h1 className="text-6xl font-bold mb-4 text-black dark:text-white">404</h1>
      <h2 className="text-2xl font-semibold mb-6 text-neutral-600 dark:text-neutral-400">
        Page Not Found
      </h2>
      <p className="text-lg mb-8 text-neutral-600 dark:text-neutral-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
}
`;

  await writeFileWithDir('app/not-found.tsx', notFoundContent);
}

async function createErrorPage() {
  const errorContent = `"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">
        Something went wrong!
      </h1>
      <p className="text-lg mb-8 text-neutral-600 dark:text-neutral-400">
        An unexpected error has occurred.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  )
}
`;

  await writeFileWithDir('app/error.tsx', errorContent);
}

async function createLoadingPage() {
  const loadingContent = `import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Skeleton className="h-12 w-3/4 mb-6" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
`;

  await writeFileWithDir('app/loading.tsx', loadingContent);
}

async function createSitemap() {
  const sitemapContent = `import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: \`\${baseUrl}/about\`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: \`\${baseUrl}/contact\`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: \`\${baseUrl}/privacy\`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: \`\${baseUrl}/terms\`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
`;

  await writeFileWithDir('app/sitemap.ts', sitemapContent);
}

async function createRobots() {
  const robotsContent = `import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: \`\${baseUrl}/sitemap.xml\`,
  }
}
`;

  await writeFileWithDir('app/robots.ts', robotsContent);
}

async function createOptimizedNextConfig() {
  const nextConfigContent = `import type { NextConfig } from "next"
import { createMDX } from 'fumadocs-mdx/next'

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header

  // Turbopack is enabled by default in Next.js 16
  turbopack: {
    // Turbopack already optimizes bundles automatically
    // No additional config needed for most cases
  },

  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*', 'next-themes'],
    // Faster server component rendering
    serverComponentsHmrCache: true,
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'], // Use modern formats
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
`;

  await writeFile('next.config.ts', nextConfigContent);
}

async function createInstrumentation() {
  const instrumentationContent = `export function onRouterTransitionStart(url: string) {
  if (typeof performance !== 'undefined') {
    performance.mark(\`nav-start-\${url}\`)
  }
}

export function onRouterTransitionComplete(url: string) {
  if (typeof performance !== 'undefined') {
    performance.mark(\`nav-complete-\${url}\`)
    
    // Measure navigation performance
    const startMark = performance.getEntriesByName(\`nav-start-\${url}\`)[0]
    const completeMark = performance.getEntriesByName(\`nav-complete-\${url}\`)[0]
    
    if (startMark && completeMark) {
      const duration = completeMark.startTime - startMark.startTime
      console.log(\`Navigation to \${url} took \${duration.toFixed(2)}ms\`)
    }
  }
}
`;

  await writeFileWithDir('app/instrumentation.ts', instrumentationContent);
}

async function createSuspenseWrapper() {
  const suspenseWrapperContent = `"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function SuspenseWrapper({ 
  children,
  fallback = <Skeleton className="h-64 w-full" />
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Skeleton className="h-12 w-3/4 mb-6" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-2/3 mb-8" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
`;

  await writeFileWithDir('components/suspense-wrapper.tsx', suspenseWrapperContent);
}

async function createStreamingLayout() {
  const streamingLayoutContent = `import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Server Component - renders fast, no hydration needed
export function StreamingSection({ 
  children,
  fallback = <Skeleton className="h-32 w-full" />
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

// Use this wrapper for slow data fetches
export function StreamingContent({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    }>
      {children}
    </Suspense>
  )
}
`;

  await writeFileWithDir('components/streaming-layout.tsx', streamingLayoutContent);
}

async function createOptimizedFonts() {
  const fontsContent = `import { Inter } from "next/font/google"

// Optimize font loading - prevents layout shift
export const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Use fallback font while loading
  preload: true,
  variable: "--font-inter",
  fallback: ["system-ui", "arial"],
})

// For headings - load only when needed
export const interTight = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
  variable: "--font-inter-tight",
})
`;

  await writeFileWithDir('lib/fonts.ts', fontsContent);
}

/**
 * Helper function to ensure directory exists before writing files
 * @param {string} filePath - The full path to the file
 */
async function ensureDir(filePath) {
  const dir = filePath.substring(0, filePath.lastIndexOf('/'));
  if (dir) {
    await mkdir(dir, { recursive: true });
  }
}

/**
 * Helper function to write file with automatic directory creation
 * @param {string} filePath - The full path to the file
 * @param {string} content - The content to write
 */
async function writeFileWithDir(filePath, content) {
  await ensureDir(filePath);
  await writeFile(filePath, content);
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise<any>} The result of the function
 */
async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(2, i);
        console.log(`  Retrying in ${waitTime}ms... (attempt ${i + 2}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

/**
 * Execute a command with retry logic for network-related operations
 * @param {string[]} args - Command arguments
 * @param {Object} options - Execution options
 * @returns {Promise<void>}
 */
async function execWithRetry(command, args, options = {}) {
  return retryWithBackoff(
    () => execa(command, args, options),
    3,
    2000
  );
}

/**
 * Sets up Fumadocs for documentation with isolated layout
 * @async
 * @returns {Promise<void>}
 */
async function setupFumadocs() {
  // Install Fumadocs dependencies
  await execWithRetry('npm', [
    'install',
    'fumadocs-ui',
    'fumadocs-core',
    'fumadocs-mdx',
    'fumadocs-typescript',
    'shiki'
  ], { stdio: 'inherit' });

  // Create docs directory structure
  await mkdir('content/docs', { recursive: true });

  // Create source.config.ts for Fumadocs
  await createSourceConfig();

  // Create source configuration
  await createDocsSourceConfig();

  // Create isolated docs layout (doesn't inherit from root layout)
  await createIsolatedDocsLayout();

  // Create docs page
  await createDocsPage();

  // Create sample documentation content
  await createDocsContent();

  // Update header to include docs link
  await updateHeaderWithDocsLink();

  // Create MDX components for docs
  await createMDXComponents();

  // Update package.json scripts to include fumadocs-mdx
  await updatePackageJsonScripts();

  // Update globals.css to include Fumadocs styles
  await updateGlobalsCssForFumadocs();

  // Generate .source folder
  console.log('\n📁 Generating documentation source files...');
  await execWithRetry('npx', ['fumadocs-mdx'], { stdio: 'inherit' });
}

/**
 * Updates globals.css to include Fumadocs UI styles
 * @async
 * @returns {Promise<void>}
 */
async function updateGlobalsCssForFumadocs() {
  const globalsCssPath = 'app/globals.css';
  let globalsCssContent = await readFile(globalsCssPath, 'utf-8');

  // Add Fumadocs imports after tailwindcss import
  if (!globalsCssContent.includes('fumadocs-ui/css')) {
    globalsCssContent = globalsCssContent.replace(
      /@import "tailwindcss";\s*\n@import "tw-animate-css";/,
      `@import "tailwindcss";\n@import "tw-animate-css";\n@import "fumadocs-ui/css/neutral.css";\n@import "fumadocs-ui/css/preset.css";\n\n@source "../node_modules/fumadocs-ui/dist/**/*.js";`
    );

    await writeFile(globalsCssPath, globalsCssContent);
  }
}

/**
 * Updates package.json scripts to include fumadocs-mdx command
 * @async
 * @returns {Promise<void>}
 */
async function updatePackageJsonScripts() {
  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));

  // Update dev and build scripts to include fumadocs-mdx
  packageJson.scripts.dev = 'fumadocs-mdx && next dev';
  packageJson.scripts.build = 'fumadocs-mdx && next build';

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}

/**
 * Creates the source.config.ts file for Fumadocs
 * @async
 * @returns {Promise<void>}
 */
async function createSourceConfig() {
  const sourceConfigContent = `import { defineDocs } from 'fumadocs-mdx/config';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
});
`;

  await writeFileWithDir('source.config.ts', sourceConfigContent);
}

/**
 * Creates the source configuration for Fumadocs
 * @async
 * @returns {Promise<void>}
 */
async function createDocsSourceConfig() {
  const sourceConfigContent = `import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx/runtime/next';
import { docs, meta } from '@/.source';
import { icons } from 'lucide-react';
import { createElement } from 'react';

export const source = loader({
  baseUrl: '/docs',
  source: createMDXSource(docs, meta),
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
});
`;

  await writeFileWithDir('lib/source.ts', sourceConfigContent);
}

/**
 * Creates an isolated layout for docs that doesn't inherit root layout
 * @async
 * @returns {Promise<void>}
 */
async function createIsolatedDocsLayout() {
  const docsLayoutContent = `import '../globals.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>
          <DocsLayout
            tree={source.pageTree}
            nav={{
              title: process.env.NEXT_PUBLIC_APP_NAME || 'Documentation',
            }}
            sidebar={{
              defaultOpenLevel: 0,
            }}
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
`;

  await writeFileWithDir('app/docs/layout.tsx', docsLayoutContent);
}

/**
 * Creates the docs page component
 * @async
 * @returns {Promise<void>}
 */
async function createDocsPage() {
  const docsPageContent = `import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
`;

  await writeFileWithDir('app/docs/[[...slug]]/page.tsx', docsPageContent);
}

/**
 * Creates sample documentation content
 * @async
 * @returns {Promise<void>}
 */
async function createDocsContent() {
  // Create index page
  const indexContent = `---
title: Introduction
description: Welcome to the documentation
---

## Welcome

This is your documentation site built with Fumadocs and Next.js 16.

### Features

- 📝 MDX support with React components
- 🎨 Beautiful UI with dark mode
- 🔍 Built-in search functionality
- ⚡ Fast and performant
- 📱 Fully responsive design

### Getting Started

Check out the [Quick Start](/docs/quick-start) guide to begin.

### Examples

\`\`\`typescript
// Example TypeScript code
function hello(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`
`;

  const quickStartContent = `---
title: Quick Start
description: Get started with your application
---

## Installation

Install the dependencies:

\`\`\`bash
npm install
\`\`\`

## Development

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Building for Production

Build your application:

\`\`\`bash
npm run build
\`\`\`

Start the production server:

\`\`\`bash
npm start
\`\`\`
`;

  const apiContent = `---
title: API Reference
description: Complete API documentation
---

## API Overview

This page contains the complete API reference for your application.

### Core Methods

#### \`hello(name: string)\`

Returns a greeting message.

**Parameters:**
- \`name\` (string): The name to greet

**Returns:**
- string: A greeting message

**Example:**

\`\`\`typescript
const message = hello("World");
console.log(message); // "Hello, World!"
\`\`\`
`;

  await writeFileWithDir('content/docs/index.mdx', indexContent);
  await writeFileWithDir('content/docs/quick-start.mdx', quickStartContent);
  await writeFileWithDir('content/docs/api.mdx', apiContent);

  // Create meta.json for sidebar configuration
  const metaContent = JSON.stringify({
    "title": "Documentation",
    "pages": ["index", "quick-start", "api"]
  }, null, 2);

  await writeFileWithDir('content/docs/meta.json', metaContent);
}

/**
 * Updates the header to include a docs link
 * @async
 * @returns {Promise<void>}
 */
async function updateHeaderWithDocsLink() {
  const headerPath = 'components/header.tsx';
  let headerContent = await readFile(headerPath, 'utf-8');

  // Add docs link to desktop navigation
  if (!headerContent.includes('href="/docs"')) {
    headerContent = headerContent.replace(
      /<HoverPrefetchLink href="\/contact">/,
      `<HoverPrefetchLink href="/docs">
            <span className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              Docs
            </span>
          </HoverPrefetchLink>
          <HoverPrefetchLink href="/contact">`
    );

    // Add docs link to mobile menu
    headerContent = headerContent.replace(
      /<Link\s+href="\/contact"\s+onClick=\{[^}]+\}\s*>/,
      `<Link
              href="/docs"
              onClick={() => setOpen(false)}
            >
              Docs
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
            >`
    );

    await writeFile(headerPath, headerContent);
  }
}

/**
 * Creates MDX components configuration
 * @async
 * @returns {Promise<void>}
 */
async function createMDXComponents() {
  const mdxComponentsContent = `import type { MDXComponents } from 'mdx/types';
import defaultComponents from 'fumadocs-ui/mdx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
  };
}
`;

  await writeFileWithDir('mdx-components.tsx', mdxComponentsContent);
}

/**
 * Organizes the app into route groups for isolated layouts
 * Moves main app pages into (main) route group, keeping docs separate
 * @async
 * @returns {Promise<void>}
 */
async function organizeRouteGroups() {
  const { rename } = await import('fs/promises');

  // Create (main) route group directory
  await mkdir('app/(main)', { recursive: true });

  // Move main app files to (main) route group
  const mainFiles = ['layout.tsx', 'page.tsx', 'error.tsx', 'loading.tsx', 'not-found.tsx'];
  const mainDirs = ['about', 'contact', 'get-started', 'privacy', 'terms'];

  for (const file of mainFiles) {
    const srcPath = `app/${file}`;
    const destPath = `app/(main)/${file}`;
    try {
      await rename(srcPath, destPath);
    } catch (error) {
      // File might not exist, continue
    }
  }

  for (const dir of mainDirs) {
    const srcPath = `app/${dir}`;
    const destPath = `app/(main)/${dir}`;
    try {
      await rename(srcPath, destPath);
    } catch (error) {
      // Directory might not exist, continue
    }
  }

  // Update (main) layout to fix globals.css import path
  const mainLayoutPath = 'app/(main)/layout.tsx';
  try {
    let mainLayoutContent = await readFile(mainLayoutPath, 'utf-8');
    mainLayoutContent = mainLayoutContent.replace(
      /import "\.\/globals\.css";/g,
      'import "../globals.css";'
    );
    await writeFile(mainLayoutPath, mainLayoutContent);
  } catch (error) {
    // Layout might not exist yet
  }

  // Update docs layout to be cleaner and isolated with proper configuration
  const docsLayoutPath = 'app/docs/layout.tsx';
  const docsLayoutContent = `import '../globals.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>
          <DocsLayout
            tree={source.pageTree}
            nav={{
              title: process.env.NEXT_PUBLIC_APP_NAME || 'Documentation',
            }}
            sidebar={{
              defaultOpenLevel: 0,
            }}
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
`;

  await writeFile(docsLayoutPath, docsLayoutContent);
}

main();