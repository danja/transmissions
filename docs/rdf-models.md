@prefix : <http://example.org/> .

:p a :Pipeline ;
:pipe (:s1 :s2 :s3 :s4 :s5 :s6) .

:s1 a :One .
:s2 a :Two.
:s3 a :Three .
:s4 a :Four .
:s5 a :Five .
:s6 a :Six .

---

generalize!

call it a :Transmission

ChatGPT suggested

@prefix : <http://example.org/> .

:p a :Pipeline ;
:then (:s1 :s2) . # Starting sequence

# Direct connections using :then for the sequence and fork

:s1 :then :s2 .
:s2 :then :s3, :s5 . # Fork after :s2
:s3 :then :s4 . # Path from :s3 to :s4
:s5 :then :s6 . # Parallel path from :s5 to :s6

:s1 a :One .
:s2 a :Two .
:s3 a :Three .
:s4 a :Four .
:s5 a :Five .
:s6 a :Six .

suggested highlighting where paths join :

:s4 :then :s7 .
:s6 :then :s7 .
:s7 a :Step . # Assuming :s7 is the step where paths merge

maybe make fork & join explicit?

# :s2 :fork :s3, :s5 .

:s2 :fork :s3 .
:s2 :fork :s5 .

:s2 :join :s4 .
:s3 :join :s4 .
