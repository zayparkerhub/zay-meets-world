-- Allow 'support' tab in submissions
ALTER TABLE submissions
  DROP CONSTRAINT IF EXISTS submissions_tab_check;

ALTER TABLE submissions
  ADD CONSTRAINT submissions_tab_check
  CHECK (tab IN ('explore', 'love', 'support'));
