-- ========================================================
-- PAPR Seed Data (with verified high-resolution product photography)
-- ========================================================

-- Categories
INSERT INTO public.categories (id, name, description, display_order) VALUES
('school', 'School Essentials', 'Curated textbooks, notebooks, geometry sets & school supplies', 1),
('college', 'College & University', 'Lab manuals, practical hardbound files, scientific instruments', 2),
('notebooks', 'Paper & Notebooks', 'Archival grid pads, Smyth-sewn journals & spiral binders', 3),
('writing', 'Fine Writing', 'Precision fineliners, Japanese gel pens & rollerballs', 4),
('office', 'Office & Workspace', 'Desk trays, solid brass clips, archiving files & markers', 5),
('art-craft', 'Art & Design', 'Bristol boards, sketch pads, technical drafting pens', 6)
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO public.products (id, name, brand, category_id, description, mrp, price, image_url, in_stock, stock_quantity, same_day_eligible, tag) VALUES
('p-nb-200', 'A4 Spiral Notebook 200 Pages (80 GSM)', 'Classmate Pulse', 'notebooks', 'Smooth bright white paper with micro-perforated sheets and snag-free twin wire binding.', 190.00, 159.00, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80', true, 120, true, 'Bestseller'),
('p-nb-100', 'Single Line Classic Notebook 120 Pages', 'Navneet Youva', 'notebooks', 'Premium chlorine-free paper, staple-bound with reinforced spine tape.', 85.00, 65.00, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=700&q=80', true, 200, true, ''),
('p-nb-grid', 'Minimalist Dot Grid Journal (100 GSM)', 'PAPR Edition', 'notebooks', 'Lay-flat binding, off-white bamboo paper, designed for daily project notes and bullet journaling.', 350.00, 280.00, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80', true, 80, true, 'Staff Pick'),
('p-pen-blue', 'Precision 0.7mm Ball Pen (Pack of 5)', 'Reynolds Jetter', 'writing', 'Ultra-smooth low viscosity ink for fatigue-free extended examination writing.', 60.00, 50.00, 'https://images.unsplash.com/photo-1518826778770-a729fb53327c?auto=format&fit=crop&w=700&q=80', true, 300, true, 'Essential'),
('p-pen-gel', 'Japanese 0.5mm Archival Gel Pen (Black)', 'Uni-ball Signo', 'writing', 'Waterproof, fade-resistant pigment ink with stainless steel tip.', 90.00, 75.00, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=700&q=80', true, 150, true, ''),
('p-pencil', 'Matte Black Graphite Pencils 2B (Pack of 10)', 'Apsara Platinum', 'writing', 'Dark, smooth lead ideal for drafting, sketching, and standardized exam sheets.', 70.00, 60.00, 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=700&q=80', true, 250, true, ''),
('p-geo', 'Precision Mathematical Drawing Set', 'Camlin Premier', 'school', 'Self-centering die-cast compass and divider, transparent acrylic bevelled rulers.', 280.00, 220.00, 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=700&q=80', true, 90, true, ''),
('p-ruler', 'Stainless Steel 30cm Metric Scale', 'PAPR Studio', 'office', 'Laser-etched markings with anti-slip cork backing and conversion tables.', 95.00, 75.00, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80', true, 110, true, ''),
('p-eraser', 'Dust-Free Archival Eraser & Sharpener', 'Faber-Castell', 'school', 'Phthalate-free eraser leaves minimal residue; dual magnesium sharpener.', 50.00, 35.00, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=700&q=80', true, 300, true, ''),
('p-cover', 'Heavy Duty Brown Book Cover Roll (10m)', 'PAPR Craft', 'school', '120 GSM recycled Kraft paper roll with printed label guides.', 80.00, 60.00, 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=700&q=80', true, 180, true, ''),
('p-label', 'Adhesive Name Labels (Pack of 60)', 'PAPR Studio', 'school', 'Matte uncoated paper stickers, accepts both fountain and gel pen ink without smudging.', 60.00, 45.00, 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=700&q=80', true, 200, true, ''),
('p-calc', 'Scientific Calculator FX-991CW ClassWiz', 'Casio', 'college', '540+ functions, natural textbook display, approved for university engineering board exams.', 1695.00, 1349.00, 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=700&q=80', true, 45, true, 'Academic Essential'),
('p-lab-physics', 'Senior Physics Laboratory Practical Manual', 'Navneet Scholar', 'school', 'CBSE syllabus experiments with observation tables, graph sheets and viva voce guide.', 240.00, 195.00, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80', true, 75, false, ''),
('p-lab-chem', 'Comprehensive Chemistry Lab Record Book', 'Navneet Scholar', 'school', 'Acid-free ruled sheets with salt analysis tables and safety protocol sheets.', 240.00, 195.00, 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=700&q=80', true, 75, false, ''),
('p-prac-file', 'Hardbound Deluxe Practical Record File', 'Solo Executive', 'college', 'Heavy board cover with stainless spring clips, index sheet and ribbon marker.', 180.00, 145.00, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=700&q=80', true, 160, true, ''),
('p-drafter', 'Engineers Mini Drafter with Canvas Bag', 'Omega Pro', 'college', 'Heavy metal clamp with unbreakable scale arms and 360-degree protractor head.', 950.00, 790.00, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=80', true, 35, false, 'Engineering'),
('p-marker', 'Chisel Tip Dry Erase Whiteboard Markers (Pack of 4)', 'Camlin White', 'office', 'Low odor, alcohol-based non-toxic ink with vivid bold colors and easy wipe off.', 140.00, 110.00, 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=700&q=80', true, 95, true, ''),
('p-highlighter', 'Pastel Textliner Soft Set (6 Subtle Tones)', 'Faber-Castell', 'writing', 'Water-based pastel inks that do not bleed through notebook pages or textbook paper.', 295.00, 240.00, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=700&q=80', true, 120, true, 'Staff Pick'),
('p-exam-pad', 'Heavy Aluminum Exam Clipboard with Ruler Lip', 'Solo Pro', 'school', 'Rigid anodized aluminum sheet with ergonomic spring clip and protective corner guards.', 220.00, 175.00, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=700&q=80', true, 85, true, ''),
('p-desk-tray', 'Stackable Powder-Coated Metal Desk Tray', 'PAPR Workspace', 'office', 'Solid metal desk organizer for A4 paperwork, project files and notebooks.', 450.00, 360.00, 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=700&q=80', true, 40, true, 'New Arrival'),
('p-clips', 'Brass Wire Binder Clips Set (Box of 24)', 'PAPR Studio', 'office', 'Architectural minimalist wire clips in matte black and natural brass finishes.', 180.00, 140.00, 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&w=700&q=80', true, 90, true, ''),
('p-tape', 'Reinforced Linen Spine Binding Tape (2-inch)', 'PAPR Bindery', 'office', 'Heavy cotton linen adhesive tape for binding dissertations, ledgers and reports.', 160.00, 125.00, 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=700&q=80', true, 60, true, ''),
-- NCERT Textbook Sets
('tb-1', 'Class 1 Complete NCERT Textbook Set', 'NCERT', 'school', 'Marigold, Rimjhim, Math-Magic, and Joyful Living series.', 650.00, 580.00, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80', true, 50, false, ''),
('tb-5', 'Class 5 Complete NCERT Textbook Set', 'NCERT', 'school', 'Looking Around EVS, Math-Magic, Hindi & English language readers.', 950.00, 860.00, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80', true, 50, false, ''),
('tb-8', 'Class 8 Complete NCERT Textbook Set', 'NCERT', 'school', 'Mathematics, Science, History, Civics, Geography & Language books.', 1350.00, 1190.00, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=700&q=80', true, 40, false, ''),
('tb-10', 'Class 10 Board Exam Complete Textbook Set', 'NCERT', 'school', 'Mathematics, Science, Social Sciences, First Flight & Footprints.', 1650.00, 1480.00, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=700&q=80', true, 60, false, 'Board Exam'),
('tb-12-sci', 'Class 12 Science PCB/PCM Textbook Set', 'NCERT', 'school', 'Physics Parts I & II, Chemistry Parts I & II, Mathematics / Biology.', 2400.00, 2150.00, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80', true, 45, false, 'Class 12'),
('tb-12-com', 'Class 12 Commerce Textbook Set', 'NCERT', 'school', 'Accountancy Parts I & II, Business Studies Parts I & II, Macroeconomics.', 2100.00, 1890.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80', true, 40, false, 'Class 12'),
('tb-12-arts', 'Class 12 Humanities & Arts Textbook Set', 'NCERT', 'school', 'Themes in Indian History, Political Science, Human Geography, Psychology.', 1950.00, 1750.00, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80', true, 30, false, 'Class 12')
ON CONFLICT (id) DO NOTHING;

-- Colleges
INSERT INTO public.colleges (id, name, short_name, city) VALUES
('prestige', 'Prestige Institute of Management & Research', 'Prestige', 'Indore'),
('sgsits', 'Shri Govindram Seksaria Institute of Technology and Science', 'SGSITS', 'Indore'),
('medicaps', 'Medi-Caps University', 'Medi-Caps', 'Indore'),
('davv', 'Devi Ahilya Vishwavidyalaya', 'DAVV', 'Indore'),
('iet-davv', 'Institute of Engineering & Technology (IET DAVV)', 'IET DAVV', 'Indore')
ON CONFLICT (id) DO NOTHING;

-- College Branches
INSERT INTO public.college_branches (id, college_id, name, stream_group) VALUES
('sgsits-cse', 'sgsits', 'Computer Science & Engineering', 'Engineering'),
('sgsits-it', 'sgsits', 'Information Technology', 'Engineering'),
('sgsits-mech', 'sgsits', 'Mechanical Engineering', 'Engineering'),
('sgsits-civil', 'sgsits', 'Civil Engineering', 'Engineering'),
('medicaps-cse', 'medicaps', 'Computer Science & Engineering', 'Engineering'),
('medicaps-ec', 'medicaps', 'Electronics & Communication', 'Engineering'),
('medicaps-pharma', 'medicaps', 'Bachelor of Pharmacy (B.Pharm)', 'Pharmacy'),
('prestige-bba', 'prestige', 'Bachelor of Business Administration', 'Management'),
('prestige-bcom', 'prestige', 'Bachelor of Commerce (Honours)', 'Commerce'),
('prestige-mba', 'prestige', 'Master of Business Administration', 'Management'),
('davv-bsc', 'davv', 'B.Sc Computer Science / IT', 'Science'),
('davv-bcom', 'davv', 'B.Com Professional', 'Commerce'),
('iet-cse', 'iet-davv', 'Computer Engineering', 'Engineering'),
('iet-it', 'iet-davv', 'Information Technology', 'Engineering')
ON CONFLICT (id) DO NOTHING;
