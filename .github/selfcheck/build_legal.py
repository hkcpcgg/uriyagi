# 우리 이야기 · 약관 · 개인정보처리방침 정적 페이지 (261120 · 대표 「오늘 날짜로 시행 · 여기서 끝내」)
# 원문 = .github/legal/terms.md · privacy.md (프로젝트 기준/04 · 05 와 같은 글) → /terms/ · /privacy/
# 머리 표(판 · 근거)와 맨 끝 「운영 메모」는 빼고 올림 · 저장소 맨 위에서: python3 .github/selfcheck/build_legal.py
import os, re, html, markdown
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
src = open(os.path.join(ROOT, '.github/selfcheck/build_pages.py'), encoding='utf-8').read()
CSS = re.search(r'CSS = """(.*?)"""', src, re.S).group(1)
EXTRA = "main h2{font-size:19px;margin:28px 0 8px}main table{border-collapse:collapse;width:100%;font-size:14px;margin:10px 0}main th,main td{border:1px solid #ddd6c8;padding:6px 8px;text-align:left;vertical-align:top}main ol,main ul{padding-left:22px}.when{color:#6b6b6b;font-size:14px}"
def body(md):
    md = re.sub(r'^\|[^\n]*\n', '', md.split('---', 1)[1] if '\n---\n' in md else md, flags=re.M)
    md = re.split(r'\n---\n\s*\n## 운영 메모', md)[0]
    md = re.split(r'\n## 운영 메모', md)[0]
    return markdown.markdown(md.strip(), extensions=['tables'])
for slug, fn, title in [('terms', 'terms.md', '우리 이야기 이용약관'), ('privacy', 'privacy.md', '우리 이야기 개인정보처리방침')]:
    md = open(os.path.join(ROOT, '.github/legal', fn), encoding='utf-8').read()
    h = f"""<!DOCTYPE html>
<!-- 우리 이야기 · /{slug}/ · build_legal.py 로 만듦 · 손으로 고치지 말고 .github/legal/{fn} 를 고쳐 다시 돌림 -->
<html lang="ko"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title><meta name="description" content="{title} — 2026년 11월 20일 시행">
<link rel="canonical" href="https://uriyagi.kr/{slug}/"><meta name="theme-color" content="#1E4A76">
<link rel="icon" type="image/png" sizes="48x48" href="/uri-favicon-48.png?v=261118">
<style>{CSS}{EXTRA}</style></head>
<body>
<header><a href="/"><img src="/uri-icon-192.png" alt=""></a><a href="/"><b>우리 이야기</b></a><nav><a href="/terms/">이용약관</a><a href="/privacy/">개인정보처리방침</a></nav></header>
<main>
<h1>{title}</h1>
<p class="when">2026년 11월 20일 시행 · 운영: 사랑흐름</p>
{body(md)}
<a class="go" href="/">우리 이야기 마당으로 가기 ›</a>
</main>
<footer>우리 이야기 · uriyagi.kr · 사랑흐름 · 문의 hkcpcgg@gmail.com</footer>
</body></html>
"""
    d = os.path.join(ROOT, slug); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(h)
    print(slug, len(h))
