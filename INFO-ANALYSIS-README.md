# Information Analysis Tools Directory

This project is a modification of the original Tap4 AI Tools Directory template, converted into a comprehensive information analysis tools directory. The directory categorizes and showcases tools for information retrieval, organization, processing, visualization, and analysis.

## Completed Modifications

1. **Content Updates**:
   - Updated all text content in `messages/en.json` to reflect information analysis terminology and descriptions
   - Modified the FAQ section with relevant questions and answers for information analysis tools
   - Replaced AI-specific terms with information analysis terminology

2. **Navigation and Categories**:
   - Preserved the original category structure which maps well to information analysis domains
   - Categories include: information retrieval, information organization, information processing, information visualization, academic research, social analysis, business analysis, knowledge management, and financial analysis

3. **Visual Identity**:
   - Created a new logo (`public/images/info-analysis-logo.svg`) that represents information analysis
   - Updated references to the logo in the navigation component

4. **URL Structure**:
   - Changed tool detail URLs from `/ai/[toolName]` to `/tool/[toolName]` to better represent the domain
   - Created new page components to support this URL structure

5. **Database Integration**:
   - Maintained compatibility with the existing Supabase database structure
   - Database already contains appropriate categories and tools for information analysis

## Deployment Instructions

1. **Environment Setup**:
   - Copy `.env.example` to `.env.local`
   - Update the Supabase credentials to connect to your database instance

2. **Database Setup**:
   - Run the SQL scripts in the `db/supabase` directory to create the necessary tables
   - Load category data using `insert_category_data.sql`
   - Load tool data using the part files or the merged data file

3. **Build and Deploy**:
   - Install dependencies: `npm install` or `pnpm install`
   - Run development server: `npm run dev` or `pnpm dev`
   - Build for production: `npm run build` or `pnpm build`
   - Deploy using Vercel or your preferred hosting solution

## Customization Options

- **Language Support**: The template includes multilingual support. Update translations in the `messages/` directory.
- **Color Scheme**: Edit the Tailwind CSS theme in `tailwind.config.ts` to match your brand.
- **Additional Tools**: Add more analysis tools by inserting records into the `web_navigation` table.

## Technical Details

- Built with Next.js 13 App Router
- Uses Tailwind CSS for styling
- Integrates with Supabase for database storage
- Supports multiple languages through next-intl

## License

This project maintains the same license as the original template. See LICENSE for details. 