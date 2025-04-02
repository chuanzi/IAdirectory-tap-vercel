-- 1. Update navigation_category table
-- First, ensure all category titles are in English
UPDATE navigation_category
SET title = 'Information Retrieval'
WHERE name = 'information-retrieval' AND (title IS NULL OR title ~ '[\\u4e00-\\u9fa5]');

UPDATE navigation_category
SET title = 'Information Organization'
WHERE name = 'information-organization' AND (title IS NULL OR title ~ '[\\u4e00-\\u9fa5]');

UPDATE navigation_category
SET title = 'Information Processing'
WHERE name = 'information-processing' AND (title IS NULL OR title ~ '[\\u4e00-\\u9fa5]');

UPDATE navigation_category
SET title = 'Information Visualization'
WHERE name = 'information-visualization' AND (title IS NULL OR title ~ '[\\u4e00-\\u9fa5]');

UPDATE navigation_category
SET title = 'Academic Research'
WHERE name = 'academic-research' AND (title IS NULL OR title ~ '[\\u4e00-\\u9fa5]');

UPDATE navigation_category
SET title = 'Social Analysis'
WHERE name = 'social-analysis' AND (title IS NULL OR title ~ '[\\u4e00-\\u9fa5]');

UPDATE navigation_category
SET title = 'Business Analysis'
WHERE name = 'business-analysis' AND (title IS NULL OR title ~ '[\\u4e00-\\u9fa5]');

UPDATE navigation_category
SET title = 'Knowledge Management'
WHERE name = 'knowledge-management' AND (title IS NULL OR title ~ '[\\u4e00-\\u9fa5]');

UPDATE navigation_category
SET title = 'Financial Analysis'
WHERE name = 'financial-analysis' AND (title IS NULL OR title ~ '[\\u4e00-\\u9fa5]');

-- Update any remaining Chinese titles to their English counterparts
UPDATE navigation_category
SET title = 'Information Retrieval'
WHERE title = '信息获取';

UPDATE navigation_category
SET title = 'Information Organization'
WHERE title = '信息整理';

UPDATE navigation_category
SET title = 'Information Processing'
WHERE title = '信息加工';

UPDATE navigation_category
SET title = 'Information Visualization'
WHERE title = '信息可视化';

UPDATE navigation_category
SET title = 'Academic Research'
WHERE title = '学术分析';

UPDATE navigation_category
SET title = 'Social Analysis'
WHERE title = '社交分析';

UPDATE navigation_category
SET title = 'Business Analysis'
WHERE title = '商业分析';

UPDATE navigation_category
SET title = 'Knowledge Management'
WHERE title = 'AI知识管理';

UPDATE navigation_category
SET title = 'Financial Analysis'
WHERE title = '金融分析';

-- 2. Update web_navigation tool entries

-- Update DataLab content
UPDATE web_navigation
SET content = 'Integrated data processing and analysis platform for data organization and visualization'
WHERE name = 'datalab' OR title = 'DataLab';

-- Update WordSift content
UPDATE web_navigation
SET content = 'Text visualization tool that helps analyze and organize textual content'
WHERE name = 'wordsift' OR title = 'WordSift';

-- Update AceMap content
UPDATE web_navigation
SET content = 'Academic literature analysis tool for visualizing research paper relationships'
WHERE name = 'acemap' OR title = 'AceMap';

-- Update AMiner content
UPDATE web_navigation
SET content = 'Platform for academic network analysis providing insights on people, organizations, and research domains'
WHERE name = 'aminer' OR title = 'AMiner';

-- Update Tavily content
UPDATE web_navigation
SET content = 'Research-focused search engine with developer API for information analysis'
WHERE name = 'tavily';

-- Update Perplexity content
UPDATE web_navigation
SET content = 'Conversational AI search with deep learning models for comprehensive information retrieval'
WHERE name = 'perplexity';

-- Update All The Internet content
UPDATE web_navigation
SET content = 'Comprehensive meta-search engine that aggregates results from multiple search sources'
WHERE name = 'alltheinternet';

-- Update Carrot2 Search content
UPDATE web_navigation
SET content = 'Open-source search results clustering engine that organizes search results by topic'
WHERE name = 'carrot2';

-- Update Free Full PDF content
UPDATE web_navigation
SET content = 'Specialized search engine for finding free academic PDFs and research papers'
WHERE name = 'free-full-pdf';

-- Update TinEye content
UPDATE web_navigation
SET content = 'Reverse image search engine that finds where images appear online and their original sources'
WHERE name = 'tineye';

-- Update PaddleOCR content
UPDATE web_navigation
SET content = 'High-performance OCR toolkit supporting multiple languages for text recognition in images'
WHERE name = 'paddleocr';

-- Update details for tools with Chinese content
UPDATE web_navigation
SET detail = NULL
WHERE detail ~ '[\\u4e00-\\u9fa5]';

-- Update other tools with generic English descriptions if they have Chinese content
UPDATE web_navigation
SET content = 'Advanced information analysis tool for data processing and research'
WHERE content LIKE '%为开发者%' OR content LIKE '%结合AI%' OR content LIKE '%搜索引擎%' OR 
      content LIKE '%平台%' OR content LIKE '%工具%' OR content LIKE '%可视化%';

-- Update any remaining Chinese descriptions to English general descriptions
UPDATE web_navigation 
SET content = 'Specialized tool for information analysis and data processing'
WHERE content ~ '[\\u4e00-\\u9fa5]';  -- This matches any Chinese characters 