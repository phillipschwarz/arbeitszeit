<objective>
Add weekday display to the monthly summary view where all entries for a month are listed. The user needs to report this information at the end of each month, so each entry should clearly show which day of the week it occurred on.
</objective>

<context>
This is a German work time tracker (Arbeitszeitrechner) called "arbeitszeit":
- Tech stack: HTML, CSS, Vanilla JavaScript
- Backend: Supabase PostgreSQL
- The app displays monthly summaries showing all work entries
- User needs weekday information for end-of-month reporting
- Database schema includes a `date` field (DATE type) for each entry

Read the CLAUDE.md file for project conventions if it exists.

@index.html
@script.js
@style.css
</context>

<requirements>
1. Display the weekday (German abbreviations) for each entry in the monthly summary view
2. Weekday should be clearly visible and formatted consistently with existing UI
3. Use German weekday abbreviations: Mo, Di, Mi, Do, Fr, Sa, So
4. Format should be user-friendly and integrate seamlessly with current entry display
5. Maintain existing functionality - only add the weekday information
</requirements>

<implementation>
1. Examine the current monthly summary view implementation in script.js to understand how entries are displayed
2. Calculate weekday from the existing date field for each entry
3. Add weekday abbreviation display to the entry rendering logic
4. Use short form abbreviations: Mo, Di, Mi, Do, Fr, Sa, So
5. Consider placement: before the date, after it, or on a separate line - choose what fits best with the existing UI layout
6. Update CSS if needed for proper styling and alignment
7. Ensure the weekday display works correctly across different date values

Use JavaScript's built-in date functions to calculate weekdays. The date field in the database is already in DATE format, so convert it to a Date object and use `.toLocaleDateString('de-DE', { weekday: 'short' })` to get the abbreviated form.
</implementation>

<output>
Modify existing files:
- `./script.js` - Add weekday calculation and display logic to monthly summary rendering
- `./style.css` - Add any necessary styling for weekday display (if needed)

Do not create new files unless absolutely necessary.
</output>

<verification>
Before declaring complete, verify:
1. Each entry in the monthly summary shows the correct weekday in German
2. The weekday display integrates visually with the existing entry layout
3. Weekdays are calculated correctly for all dates (test with different months/years)
4. The existing monthly summary functionality remains unchanged
5. The UI remains responsive and visually consistent
</verification>

<success_criteria>
- All entries in the monthly summary view display the correct German weekday
- Weekday information is clearly readable and well-formatted
- No existing functionality is broken
- Code follows existing project patterns and conventions
</success_criteria>
