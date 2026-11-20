# -*- coding: utf-8 -*-
# 261120 검색에 여는 안내 페이지 — /guide/ (사용법 · 안내 방 C-0295) · /story/ (활용 · 강점 · C-0030)
# 쓰는 법: python3 .github/selfcheck/build_pages.py  (저장소 맨 위에서) → guide/index.html · story/index.html · sitemap.xml
# 글은 시트 「기록」 의 안내 방 · 활용 방 게시물과 같게 맞춰 둠(방 글을 고치면 여기도 고쳐 다시 돌림)
import os, glob, html, datetime

ROOT = os.getcwd()
SITE = 'https://uriyagi.kr'
TODAY = datetime.date.today().isoformat()

GUIDE = [
 ("우리 이야기에 오신 것을 환영해요", "우리의 오늘이 모여, 소중한 추억이 됩니다.\n\n주말 러닝, 동아리 엠티, 오랜만에 모인 동기 모임.\n함께한 날의 사진을 한 방에 모아 두면 언제든 그날로 돌아갈 수 있어요.\n\n이 안내는 우리 이야기를 처음 쓰는 분을 위한 사용법이에요.\n그림에서 노란 말풍선이 가리키는 곳을 그대로 눌러 보세요."),
 ("화면 아래 네 칸부터 알아 둬요", "화면 맨 아래에는 네 칸이 늘 있어요.\n\n① 마당 — 여러 방 사진이 모이는 첫 화면\n② 검색 — 방 이름으로 찾기\n③ 내 방 — 내가 들어간 방과 새 소식\n④ 올리기(주황 동그라미 ＋) — 사진 올리기\n\n오른쪽 위 ☰ 를 누르면 메뉴가 열려요."),
 ("마당에서 둘러봐요", "첫 화면 「마당」에는 여러 방의 사진이 섞여 흘러요.\n\n① 위쪽 동그라미 줄에서 방 하나를 눌러 보세요.\n② 그 방 첫 화면으로 바로 들어가요.\n\n「(견본)」이 붙은 방은 사용법을 보여 드리려고 꾸민 방이에요."),
 ("방 이름으로 찾아요", "아는 방이 있으면 이름으로 찾을 수 있어요.\n\n① 아래 「검색」을 눌러요.\n② 칸에 방 이름을 적어요."),
 ("방 첫 화면은 이렇게 생겼어요", "방에 들어가면 맨 위에 방 사진 · 이름 · 소개가 있어요.\n그 아래 「사진 · 영상 · 글」 칸으로 나눠 볼 수 있고,\n사진은 바둑판처럼 쭉 이어져요. 아래로 내리면 계속 나와요."),
 ("사진을 크게 봐요", "① 바둑판에서 보고 싶은 사진을 눌러요.\n② 사진이 화면 가득 열려요.\n\n위로 밀면 다음 사진, 아래로 밀면 앞 사진이에요.\n점(• • •)이 있으면 옆으로 밀어 같은 날 사진을 더 봐요.\n사진을 한 번 톡 누르면 단추가 숨고, 다시 누르면 나와요.\n두 손가락으로 벌리면 크게 볼 수 있어요."),
 ("♥ 좋아요", "마음에 드는 사진에는 오른쪽 ♥ 를 눌러 주세요.\n사진을 두 번 톡톡 눌러도 ♥ 가 돼요. 큰 하트가 톡 터져요!\n누른 ♥ 는 빨갛게 채워지고, 다시 누르면 처음대로 돌아가요."),
 ("🍇 나도 기억해요", "그날 그 자리에 함께 있었다면 🍇 「나도 기억해요」를 눌러 주세요.\n「나도 그때를 기억해요」라는 표시예요. 누르면 포도알이 톡 퍼지고, 포도가 제 색으로 바뀌어요."),
 ("💬 기억 남기기", "사진 한 장에도 저마다 기억이 달라요.\n\n① 오른쪽 💬 를 눌러요.\n② 밑에서 기억 창이 올라와요. 다른 분이 남긴 기억도 여기서 봐요.\n③ 「기억 남기기」를 눌러 그날의 한 장면을 적어 주세요."),
 ("카톡으로 나눠요", "함께했던 친구에게 사진을 보내 보세요.\n\n① 오른쪽 공유 단추를 눌러요.\n② 보낼 사진을 골라요. 한 번에 10장까지, 아래에 「10장 중 ○장」으로 보여 드려요.\n③ 「카톡으로 보내기」를 눌러 친구를 골라요.\n\n받은 친구가 링크를 누르면 바로 이 방으로 들어와요."),
 ("사진을 휴대폰에 저장해요", "① 사진을 열고 오른쪽 맨 아래 ⋯ 를 눌러요.\n② 「휴대폰에 저장」을 누르면 사진이 휴대폰에 담겨요.\n저장 창이 뜨면 「이미지 저장」을 골라 주세요.\n\n전체 공개 사진은 누구나, 그 밖의 사진은 그 방 멤버만 저장할 수 있어요."),
 ("⋯ 더 보기", "오른쪽 맨 아래 ⋯ 를 누르면 메뉴가 열려요.\n\n· 공유하기 · 휴대폰에 저장 · 기억 보기\n· 삭제 요청 — 내가 나온 사진을 내리고 싶을 때. 누르는 즉시 그 사진은 안 보이게 돼요.\n\n내가 올린 게시물이면 수정 · 삭제도 여기서 해요."),
 ("카카오로 들어와요", "구경은 누구나 할 수 있어요.\n사진을 올리거나 기억을 남기려면 카카오로 한 번만 들어오면 돼요.\n\n① 「만 14세 이상입니다」에 ✓ 표시를 해요.\n② 노란 「카카오 로그인」을 눌러요."),
 ("사진 올리기", "① 아래 주황 동그라미 「올리기」를 눌러요.\n② 휴대폰 앨범에서 사진을 골라요. 한 번에 20장까지 돼요.\n③ 한마디를 적고(비워도 돼요) 「올리기」를 눌러요.\n\n방 사진을 보다가 생각나면 방 맨 아래 「나도 사진 올리기」로 바로 보태 주세요."),
 ("친구 초대하기", "함께할 친구를 불러 주세요.\n\n① 방 첫 화면의 「초대하기」를 눌러요.\n② 카톡으로 친구나 단톡방을 골라 보내요.\n\n받은 친구는 링크를 누르면 바로 그 방으로 들어와요."),
 ("우리 이야기방 만들기", "우리 모임 방은 몇 번만 누르면 열려요.\n\n① ☰ 메뉴나 내 방에서 「우리 이야기방 만들기」를 눌러요.\n② 어떤 방인가요? — 모임 · 친구 · 가족 등에서 골라요.\n③ 방 이름 · 짧은 소개 · 대표 사진을 정하면 끝이에요. 대표 사진은 휴대폰 앨범에서 바로 골라요."),
 ("공개 방과 닫힌 방", "방은 누구나 보는 공개 방과, 멤버만 보는 닫힌 방이 있어요.\n닫힌 방 동그라미에는 🔒 가 붙어요.\n\n① 🔒 방을 누르면\n② 「방 두드리기」가 나와요. 누르면 방 관리자가 확인한 뒤 들어갈 수 있어요."),
 ("내 방 — 내 소식이 모이는 곳", "아래 「내 방」에는 내가 들어간 방과 새 소식이 모여요.\n누가 내 사진에 기억을 남겼는지, ♥ 를 눌렀는지 맨 위 「새 소식」에서 봐요.\n내 얼굴 동그라미를 누르면 내 사진을 바꿀 수 있어요."),
 ("방 관리자가 챙길 일", "방을 만든 분은 방 관리자예요.\n방 첫 화면 맨 위에 「처리할 일」과 「방 관리 ›」가 보여요.\n\n① 「방 관리 ›」를 눌러요.\n② 처음 한 번은 「카카오로 관리 확인」을 해요. 확인하면 6시간 동안 관리 기능을 쓸 수 있어요.\n③ 「처리할 일」에서 가입 신청 · 삭제 요청을 한눈에 챙겨요. 멤버 관리 · 공개 범위 바꾸기도 여기서 해요."),
 ("내가 올린 게시물 고치기 · 지우기", "내가 올린 게시물은 언제든 고칠 수 있어요.\n\n① 사진을 열고 오른쪽 맨 아래 ⋯ 를 눌러요.\n② 내가 올린 것이면 「수정」 · 「삭제」가 나와요.\n\n여러 장 중 몇 장만 내리려면 「사진 고르기」를 써요. 게시물을 통째로 지울 때는 한 번 더 물어봐요."),
 ("휴대폰 첫 화면에 두기", "우리 이야기를 앱처럼 휴대폰 첫 화면에 둘 수 있어요.\n\n① 오른쪽 위 ☰ 를 눌러요.\n② 「홈 화면에 추가」를 눌러요.\n③ 안내대로 하면 포도 아이콘이 생겨요."),
 ("자주 묻는 것", "카톡에서 링크를 눌렀더니 인터넷 창으로 넘어갔어요.\n— 사진을 여러 장 고르기 좋도록 휴대폰 인터넷으로 열어 드려요. 들어와 계시던 그대로 이어져요.\n\n소리가 나요?\n— 우리 이야기는 소리를 내지 않아요. 영상도 소리를 끈 채 시작해요.\n\n더 궁금한 것이 있어요.\n— 「우리 이야기 안내」 방 사진에 💬 기억으로 남겨 주시면 답해 드릴게요."),
 ("함께 지켜 주세요", "· 사진 속 다른 분이 원하지 않으면 「삭제 요청」으로 바로 내려 드려요.\n· 아이 사진은 그 방에서만 보이게 올려 주세요.\n· 다른 분이 찍은 사진은 허락을 받고 올려 주세요.\n\n우리의 오늘이 모여, 소중한 추억이 됩니다. 반가워요!"),
]

STORY = [
 ("방 하나가 다른 방을 비춥니다", "옛사람들은 하늘에 끝없는 그물이 걸려 있다고 했습니다.\n그물코마다 구슬이 하나씩 달려 있고, 구슬 하나하나가 다른 모든 구슬을 비춘다고요.\n이것을 인드라망이라 부릅니다.\n\n우리 이야기의 방 하나하나가 그 구슬입니다.\n나의 방, 우리 가족 방, 함께 달리는 모임 방, 그리고 동네 작은 공방의 방까지.\n따로 빛나면서, 서로를 비춥니다."),
 ("우리 이야기가 잘하는 것", "쌓입니다 — 오늘 올린 사진이 내일도, 10년 뒤에도 그 자리에 있습니다. 어제와 오늘이 모여 우리의 역사가 됩니다.\n이어집니다 — 방과 방이 손을 잡습니다. 우리 모임 방에서 이웃 모임, 우리 마을 이야기로 자연스럽게 건너갑니다.\n열고 닫습니다 — 모두와 나눌 이야기는 활짝, 우리끼리 간직할 이야기는 살며시. 방마다, 사진마다 고를 수 있습니다.\n링크 하나면 됩니다 — 카톡으로 받은 링크를 누르면 바로 그 방입니다. 따로 깔 것도, 외울 것도 없습니다.\n마당에서 만납니다 — 여러 방의 이야기가 마당에 함께 흐릅니다. 몰랐던 이웃의 하루를 우연히 만납니다.\n소중히 지킵니다 — 우리 사진은 우리나라 안에 안전하게 보관합니다."),
 ("나의 하루가 나의 역사가 됩니다", "오늘 걸은 길, 오늘 먹은 밥, 오늘 만난 하늘.\n혼자 보는 일기처럼 닫아 두어도 좋고, 가끔은 열어 마당에 내놓아도 좋습니다.\n몇 해가 지나 돌아보면, 나라는 사람이 걸어온 길이 한눈에 보입니다."),
 ("멀리 있어도 한 지붕 아래", "아이가 처음 걸은 날, 할머니 생신, 이사 가던 날.\n우리끼리만 보는 방이라 마음 놓고 올립니다.\n멀리 사는 할아버지도, 바쁜 삼촌도 같은 방에서 같은 날을 봅니다.\n손주가 자라 이 방을 열면, 우리 집안의 이야기가 거기 있습니다."),
 ("함께한 날이 쌓이면 우리의 자랑이 됩니다", "수영 · 자전거 · 산행 · 러닝 · 사진 · 독서 · 텃밭 · 합창…\n\n같이 달린 날, 같이 오른 산이 차곡차곡 쌓입니다.\n방을 열어 두면 활동하는 모습이 그대로 우리 모임의 소개가 되고, 새 친구가 찾아옵니다.\n다른 동네의 같은 취미 모임과도 이어져, 서로 응원하고 함께 모입니다."),
 ("그때 그 친구들, 그리고 우리 학교", "졸업하고 흩어진 친구들이 한 방에 다시 모입니다.\n기수마다의 이야기가 모이면 동문 모두의 이야기가 되고, 학교 소식을 함께 나눕니다.\n운동장의 옛 사진과 오늘의 사진이 나란히 놓여 학교의 어제와 오늘을 알 수 있습니다.\n그렇게 학교의 역사가 쌓입니다."),
 ("저마다의 이야기가 마을의 이야기로", "공방은 오늘 빚은 그릇을, 갤러리는 새 전시를, 체험관은 아이들의 웃음을 올립니다.\n하나하나는 작은 방이지만, 모이면 마을 전체가 살아 있는 이야기책이 됩니다.\n찾아오는 손님은 미리 마을을 둘러보고, 다녀간 뒤에는 추억을 남깁니다.\n우리 동네, 우리 지역의 이웃들과도 소식이 자연스럽게 오갑니다."),
 ("어디로든 뻗어 나갑니다", "작은 방 하나가 다른 방을 아우르고, 그 방이 또 다른 방과 이어집니다.\n위로는 더 큰 모임과 지역으로, 옆으로는 뜻이 같은 이웃으로, 아래로는 새로 생긴 작은 모임으로.\n정해진 길이 있는 것이 아니라, 우리가 이어 가는 만큼 길이 됩니다.\n그물코 하나를 들면 그물 전체가 따라 올라오듯, 우리의 이야기 하나가 모두의 이야기를 비춥니다."),
 ("시작해 보세요", "마당 아래 「＋ 우리 이야기방 만들기」 — 이름 하나면 방이 열립니다.\n사진 한 장 올리고, 카톡으로 링크를 보내 보세요.\n처음이시면 「우리 이야기 사용법」을 펼쳐 보세요."),
]

ROOMS = [  # 검색에 여는 방(손님 보기 주소 ?c= · 초대 열쇠 없음)
 ("C-0295", "우리 이야기 안내"),
 ("C-0030", "사랑흐름 우리 이야기"),
 ("C-0294", "(견본) 우리들의 주말 러닝"),
 ("C-0258", "(견본) 주말 산행 모임"),
 ("C-0257", "(견본) 평생학습관 수영 동호회"),
 ("C-0256", "(견본) 문산 자전거 동호회"),
]

CSS = """*{box-sizing:border-box}body{margin:0;background:#f6f4ef;color:#1d2433;font:16px/1.75 -apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif;word-break:keep-all}
a{color:#1E4A76}header{position:sticky;top:0;z-index:2;background:#1E4A76;color:#fff;display:flex;align-items:center;gap:10px;padding:10px 16px}
header img{width:30px;height:30px;border-radius:8px}header b{font-size:17px}header a{color:#fff;text-decoration:none}header nav{margin-left:auto;display:flex;gap:14px;font-size:14px}
main{max-width:640px;margin:0 auto;padding:22px 16px 40px}h1{font-size:25px;line-height:1.4;margin:6px 0 6px}.lead{color:#555;margin:0 0 18px}
.toc{background:#fff;border-radius:14px;padding:12px 16px;margin:0 0 24px;columns:2;column-gap:18px;font-size:14px}.toc a{display:block;text-decoration:none;padding:3px 0}
article{background:#fff;border-radius:16px;padding:18px 16px 16px;margin:0 0 18px;box-shadow:0 1px 3px rgba(0,0,0,.06)}article h2{font-size:19px;margin:0 0 8px}
article p{margin:0 0 10px;white-space:pre-line}.ph{display:flex;gap:8px;overflow-x:auto;margin:10px -4px 0;padding:0 4px}.ph img:first-child{margin-left:auto}.ph img:last-child{margin-right:auto}.ph img{flex:0 0 auto;border-radius:12px;background:#eee;max-width:100%;height:auto}
.g .ph img{width:calc(50% - 4px);min-width:150px}.s .ph img{width:100%}.no{display:inline-block;min-width:26px;height:26px;line-height:26px;border-radius:13px;background:#F08A24;color:#fff;text-align:center;font-size:13px;margin-right:6px;vertical-align:2px}
.rooms{background:#fff;border-radius:16px;padding:16px;margin:26px 0 0}.rooms h2{font-size:18px;margin:0 0 8px}.rooms a{display:block;padding:8px 0;border-top:1px solid #eee;text-decoration:none}
.go{display:block;text-align:center;background:#F08A24;color:#fff;border-radius:26px;padding:13px;margin:24px 0 0;text-decoration:none;font-weight:700}
footer{text-align:center;color:#888;font-size:13px;padding:10px 0 30px}"""


def esc(s):
    return html.escape(s, quote=True)


def imgs(folder, n):
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'seed', folder, 'p%02d_[0-9].jpg' % n))):
        b = os.path.basename(f)
        out.append('/seed/%s/%s' % (folder, b))
    return out


def page(path, title, desc, h1, lead, posts, folder, cls, other):
    url = SITE + path
    toc = ''.join('<a href="#p%d"><span class="no">%d</span>%s</a>' % (i + 1, i + 1, esc(t)) for i, (t, _) in enumerate(posts))
    arts = []
    for i, (t, body) in enumerate(posts):
        ims = imgs(folder, i + 1)
        ph = ''
        if ims:
            ph = '<div class="ph">' + ''.join('<img src="%s" alt="%s" loading="%s" decoding="async">' % (u, esc(t), 'eager' if i == 0 else 'lazy') for u in ims) + '</div>'
        arts.append('<article id="p%d"><h2><span class="no">%d</span>%s</h2><p>%s</p>%s</article>' % (i + 1, i + 1, esc(t), esc(body), ph))
    rooms = ''.join('<a href="/?c=%s">%s ›</a>' % (c, esc(n)) for c, n in ROOMS)
    ld = '{"@context":"https://schema.org","@type":"WebPage","name":%s,"description":%s,"url":"%s","inLanguage":"ko","isPartOf":{"@type":"WebSite","name":"우리 이야기","url":"%s/"}}' % (
        '"' + title.replace('"', '') + '"', '"' + desc.replace('"', '') + '"', url, SITE)
    h = f"""<!DOCTYPE html>
<!-- 우리 이야기 · {path} · build_pages.py 로 만듦({TODAY}) · 손으로 고치지 말고 build_pages.py 를 고쳐 다시 돌림 -->
<html lang="ko"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="우리 이야기">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{SITE}/uri-og.png">
<meta name="theme-color" content="#1E4A76">
<link rel="icon" type="image/png" sizes="48x48" href="/uri-favicon-48.png?v=261118"><link rel="apple-touch-icon" href="/uri-apple-180.png?v=261118">
<script type="application/ld+json">{ld}</script>
<style>{CSS}</style></head>
<body class="{cls}">
<header><a href="/"><img src="/uri-icon-192.png" alt=""></a><a href="/"><b>우리 이야기</b></a><nav><a href="/guide/">사용법</a><a href="/story/">활용 · 강점</a></nav></header>
<main>
<h1>{esc(h1)}</h1>
<p class="lead">{esc(lead)}</p>
<nav class="toc">{toc}</nav>
{''.join(arts)}
<a class="go" href="/">우리 이야기 마당으로 가기 ›</a>
<section class="rooms"><h2>둘러볼 수 있는 방</h2>{rooms}</section>
<p style="margin-top:22px;text-align:center"><a href="{other[0]}">{esc(other[1])} ›</a></p>
</main>
<footer>우리 이야기 · uriyagi.kr</footer>
</body></html>
"""
    d = os.path.join(ROOT, path.strip('/'))
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(h)
    return url


u1 = page('/guide/', '우리 이야기 사용법 — 사진을 함께 모으는 방, 이렇게 써요',
          '우리 이야기 사용법 23가지. 마당 둘러보기, 방 찾기, 사진 크게 보기, 좋아요 · 나도 기억해요 · 기억 남기기, 카톡으로 나누기, 사진 올리기, 친구 초대, 우리 이야기방 만들기까지 그림으로 차근차근.',
          '우리 이야기 사용법', '우리의 오늘이 모여, 소중한 추억이 됩니다. 처음 오셨다면 한 편씩 따라 해 보세요.',
          GUIDE, 'guide', 'g', ('/story/', '우리 이야기는 이렇게 쓰여요 — 활용 · 강점'))
u2 = page('/story/', '우리 이야기는 이렇게 쓰여요 — 나 · 가족 · 동호회 · 동문 · 마을',
          '나의 하루부터 가족, 동호회, 동창 · 동문, 공방과 갤러리가 모인 마을까지. 방 하나하나가 서로를 비추며 이어지는 우리 이야기의 쓰임새와 강점을 소개합니다.',
          '우리 이야기는 이렇게 쓰여요', '방 하나하나가 구슬처럼 서로를 비추며, 위로 · 옆으로 · 아래로 이어집니다.',
          STORY, 'story', 's', ('/guide/', '우리 이야기 사용법'))

urls = [(u1, '0.9'), (u2, '0.9')] + [(SITE + '/?c=' + c, '0.6') for c, _ in ROOMS]
urls += [(SITE + '/terms/', '0.3'), (SITE + '/privacy/', '0.3')]  # 약관 · 처리방침(261120 시행) — 다시 돌려도 빠지지 않게
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
    '  <url><loc>%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>\n' % (html.escape(u), TODAY, p) for u, p in urls) + '</urlset>\n'
open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write(sm)
print('ok', u1, u2, len(urls), 'urls')
