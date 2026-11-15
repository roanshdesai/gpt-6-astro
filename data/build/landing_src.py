"""Hand-written content for data/landing.json (backend part 6).

build_landing.py turns this into data/landing.json and fails if any quote is
not word for word in its saved NASA page. `text` is written plain English for
the card; the `quote` under it is NASA's own words and backs every fact in it.
The incident cards are not ranked evidence and do not count toward strength.
"""

# The Apollo 1 page is the one NASA's challenge page lists as a resource (its
# Apollo, Challenger, Columbia Lessons Learned Program page).
#
# There is no Apollo 13 card. The Apollo 13 page the challenge lists
# (https://sma.nasa.gov/sma-disciplines/accllp/apollo-13, saved as
# data/raw/sources/sma-apollo-13.txt) says the oxygen tank blew up but never
# says what set it off, so it cannot back a card in a list of fires.
A1_LESSONS = "https://sma.nasa.gov/sma-disciplines/accllp/apollo-1"
MIR_FIRE = "https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/"
# NASA's own record of the video the challenge page lists. The library page a
# person opens is drawn by script, so the quote is checked against this file.
COMBUSTION_VIDEO_RECORD = "https://images-assets.nasa.gov/video/264_StudyingCombustionOnTheISS/metadata.json"

INCIDENTS = [
    {
        "id": "apollo-1",
        "year": "1967",
        "name": "Apollo 1",
        "text": "During a test on the launch pad, with the hatches closed and the cabin filled with pure oxygen, a flash fire swept through the spacecraft. All three astronauts died.",
        "quote": "Because of the pure oxygen atmosphere, the fire spread quickly, causing a rapid rise in temperature and pressure that led to the rupture of the Command Module pressure vessel.",
        "source": A1_LESSONS,
        "sourceTitle": "NASA Safety and Mission Assurance: Apollo 1",
        # Facts in `text` that the quote does not carry, each word for word on the same page.
        "support": [
            "On Jan. 27, Grissom, White and Chaffee were scheduled to conduct a key test on the launch pad",
            "The astronauts would be wearing spacesuits with the spacecraft’s hatches closed and the cabin pressurized with 100% oxygen.",
            "During the test, a flash fire swept through the spacecraft so quickly, there was no time to open the hatches.",
            "By the time the pad crew was able to open the hatches, the crew had already perished.",
        ],
    },
    {
        "id": "mir",
        "year": "1997",
        "name": "Mir",
        "text": "An oxygen generator caught fire, blocked the way to an escape craft and filled the station with smoke. The crew put it out, with no lasting harm.",
        "quote": "On Feb. 24, 1997, the six crew members aboard the Russian space station Mir faced significant danger when a fire ignited in an oxygen generating system.",
        "source": MIR_FIRE,
        "sourceTitle": "NASA History: 25 Years Ago: Fire Aboard Space Station Mir",
        "support": [
            "The searing flame, lasting several minutes, not only cut off access to one of the two Soyuz escape vehicles but also filled the station’s modules with smoke.",
            "the crew prevailed and extinguished the flames",
            "with no lasting harm to the crew members",
        ],
    },
]

# The landing's video link: the ScienceCasts video NASA's challenge page lists.
# `url` is the video itself, `nasaUrl` its page in the NASA Image and Video
# Library, and the quote is NASA's description of it, from the library's record.
VIDEO = {
    "title": "The Power of Studying Combustion on the ISS",
    "url": "https://www.youtube.com/watch?v=W1oXykoz9zg",
    "nasaUrl": "https://images.nasa.gov/details/264_StudyingCombustionOnTheISS",
    "quote": "Scientists are learning more about combustion through a series of experiments on the International Space Station.",
    "source": COMBUSTION_VIDEO_RECORD,
    "sourceTitle": "NASA Image and Video Library: The Power of Studying Combustion on the ISS",
}
